import { Inject, Injectable, NgZone } from '@angular/core';
import { ChartConfiguration, ScaleOptions, CartesianScaleOptions } from 'chart.js';
import produce from 'immer';
import { isNumber, mapValues, merge } from 'lodash-es';
import { BehaviorSubject, map, ReplaySubject, scan, tap, throttleTime } from 'rxjs';
import { TimelineChartType, ManagedDataLayer, Dataset, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { TIME_SCALE_OPTIONS } from '../fhir-mappers/fhir-mapper-options';
import { ChartAnnotation, ChartAnnotations, ChartScales, isDefined, isValidScatterDataPoint, NumberRange } from '../utils';

export type TimelineConfiguration = ChartConfiguration<TimelineChartType, TimelineDataPoint[]>;

type MergedDataLayer = {
  datasets: Dataset[];
  scales: Record<string, ScaleOptions>;
  annotations: ChartAnnotations;
};

/** Builds a ChartConfiguration object from a DataLayerManager's selected layers */
@Injectable({
  providedIn: 'root',
})
export class FhirChartConfigurationService {
  constructor(
    private layerManager: DataLayerManagerService,
    @Inject(TIME_SCALE_OPTIONS) private timeScaleOptions: ScaleOptions<'time'>,
    private ngZone: NgZone
  ) {}

  private timeline: ScaleOptions<'time'> = {
    ...this.timeScaleOptions,
    afterDataLimits: (axis) => this.ngZone.run(() => this.timelineRangeSubject.next({ max: axis.max, min: axis.min })),
  };
  private timelineRangeSubject = new ReplaySubject<NumberRange>();
  timelineRange$ = this.timelineRangeSubject.pipe(throttleTime(100, undefined, { leading: true, trailing: true }));

  private config: TimelineConfiguration | null = null;
  configSubject = new BehaviorSubject<TimelineConfiguration>(this.buildConfiguration());
  chartConfig$ = this.layerManager.selectedLayers$.pipe(
    map((layers) => this.mergeLayers(layers)),
    scan((config, layer) => this.updateConfiguration(config, layer), this.buildConfiguration()),
    tap((config) => {
      this.config = config;
    })
  );

  private lockZoomRange = false;

  lockTimelineRange({ min, max }: NumberRange) {
    this.lockZoomRange = true;
    this.timeline.min = min;
    this.timeline.max = max;
  }

  unlockTimelineRange(datasets?: Dataset[]) {
    this.lockZoomRange = false;
    datasets = datasets ?? this.config?.data.datasets;
    if (datasets) {
      const values = datasets.flatMap((dataset) => dataset.data.map((point) => point.x).filter((x) => !Number.isNaN(x)));
      this.timeline.min = Math.min(...values);
      this.timeline.max = Math.max(...values);
    }
  }

  mergeLayers(layers: ManagedDataLayer[]): MergedDataLayer {
    layers = arrangeScales(layers);
    layers = setScaleBounds(layers);
    const enabledLayers = layers.filter((layer) => layer.enabled);
    const datasets = enabledLayers.flatMap((layer) => layer.datasets).filter((dataset) => !dataset.hidden);
    const scales = Object.assign({}, ...enabledLayers.map((layer) => ({ [layer.scale.id]: layer.scale })));
    const annotations = enabledLayers.flatMap((layer) => layer.annotations).filter(isDefined);
    return { datasets, scales, annotations };
  }

  updateConfiguration(config: TimelineConfiguration, merged: MergedDataLayer): TimelineConfiguration {
    const datasets = merged.datasets.map((dataset) => merge(findDataset(config, dataset), dataset));
    const scales = mapValues(merged.scales, (scale, key) => merge(findScale(config, key), scale));
    const annotations = merged.annotations?.map((anno) => merge(findAnnotation(config, anno), anno));
    return this.buildConfiguration(datasets, scales, annotations);
  }

  /** Build a chart configuration object to display the given datasets, scales, and annotations */
  buildConfiguration(datasets: Dataset[] = [], scales: ChartScales = {}, annotations: ChartAnnotations = []): TimelineConfiguration {
    if (!this.lockZoomRange && datasets.length > 0) {
      this.unlockTimelineRange(datasets);
    }
    return {
      type: 'line',
      data: {
        datasets,
      },
      options: {
        scales: {
          ...scales,
          timeline: this.timeline,
        },
        plugins: {
          annotation: { annotations },
          zoom: {
            zoom: {
              onZoomComplete: ({ chart }) => {
                this.lockTimelineRange(chart.scales['timeline']);
              },
            },
            pan: {
              onPanComplete: ({ chart }) => {
                this.lockTimelineRange(chart.scales['timeline']);
              },
            },
          },
          legend: {
            labels: {
              // hide legend labels for medications
              filter(item, data) {
                const dataset = data.datasets.find(({ label }) => label === item.text) as Dataset<'line'>;
                if (dataset?.yAxisID) {
                  return scales[dataset.yAxisID]?.type !== 'medication';
                }
                return true;
              },
            },
          },
        },
      },
    };
  }
}
const findDataset = (config: TimelineConfiguration, dataset: Dataset) => config.data.datasets.find(datasetEquals(dataset));
const datasetEquals = (dataset: Dataset) => (other: Dataset) => dataset.label === other.label;

const findScale = (config: TimelineConfiguration, key: string) => config.options?.scales?.[key];

const findAnnotation = (config: TimelineConfiguration, anno: ChartAnnotation) => {
  const annotations = config.options?.plugins?.annotation?.annotations ?? [];
  if (Array.isArray(annotations)) {
    return annotations.find(annotationEquals(anno));
  } else {
    throw new TypeError('Record-based annotation configuration is not yet supported. Use an Array instead.');
  }
};
const annotationEquals = (anno: ChartAnnotation) => (other: ChartAnnotation) => (anno as any).label?.content === (other as any).label.content;

/** Arrange stacked scales in the same order as the layers array by modifying the `weight` option for each scale */
const arrangeScales = produce((layers: ManagedDataLayer[]) => {
  for (let i = 0; i < layers.length; i++) {
    if (isStackedScale(layers[i].scale)) {
      layers[i].scale.weight = layers.length - i;
    }
  }
});

function isStackedScale(scale: ScaleOptions | undefined): scale is CartesianScaleOptions {
  return !!(scale && (scale as CartesianScaleOptions).stack);
}

/** Set the min/max for each scale based on the min/max values of the datasets and annotations.
 * This prevents the scale ticks from changing when zooming/panning the chart. */
const setScaleBounds = produce((layers: ManagedDataLayer[]) => {
  const padding = 0.05; // extra space to add beyond min/max values (% of scale height)
  for (let layer of layers) {
    const values = layer.datasets.flatMap((dataset) => dataset.data.filter(isValidScatterDataPoint).map((point) => point.y));
    if (layer.annotations) {
      values.push(...layer.annotations.flatMap((anno) => [anno.yMin, anno.yMax]).filter(isNumber));
    }
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const base = max === min ? min : max - min;
      const pad = base * padding;
      layer.scale.min = min - pad;
      layer.scale.max = max + pad;
    }
  }
});
