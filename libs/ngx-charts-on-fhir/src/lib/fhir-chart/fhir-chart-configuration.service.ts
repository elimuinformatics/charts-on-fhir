import { Inject, Injectable, NgZone } from '@angular/core';
import { ChartConfiguration, ScaleOptions, CartesianScaleOptions, Chart } from 'chart.js';
import produce from 'immer';
import { mapValues, merge } from 'lodash-es';
import { map, ReplaySubject, scan, tap, throttleTime } from 'rxjs';
import { TimelineChartType, ManagedDataLayer, Dataset, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { findReferenceRangeForDataset } from '../fhir-chart-summary/statistics.service';
import { TIME_SCALE_OPTIONS } from '../fhir-mappers/fhir-mapper-options';
import { ChartAnnotation, ChartAnnotations, ChartScales, isDefined, NumberRange } from '../utils';

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

  chartConfig$ = this.layerManager.selectedLayers$.pipe(
    map((layers) => this.mergeLayers(layers)),
    scan((config, layer) => this.updateConfiguration(config, layer), this.buildConfiguration()),
    tap((config) => this.updateTimelineBounds(config.data.datasets))
  );

  private timelineDataBounds: Partial<NumberRange> = { min: undefined, max: undefined };
  private isZoomRangeLocked = false;
  public get isAutoZoom() {
    return !this.isZoomRangeLocked;
  }

  /** The Chart object associated with this configuration. This is required for zoom() and resetZoom() functions. */
  private _chart?: Chart;
  get chart() {
    return this._chart;
  }
  set chart(value: Chart | undefined) {
    if (this._chart !== value) {
      this._chart = value;
    }
  }

  /** Lock the zoom range for timeline scale so it will not change when new data is added */
  private lockZoomRange({ min, max }: NumberRange) {
    this.isZoomRangeLocked = true;
    this.timeline.min = min;
    this.timeline.max = max;
  }

  /** Zoom to a specific date range and lock the zoom so it will not change when new data is added */
  zoom(range: NumberRange) {
    this.lockZoomRange(range);
    if (this.chart) {
      this.chart.zoomScale('timeline', range, 'zoom');
    }
  }

  /** Reset the zoom so it will change automatically to fit the data */
  resetZoom() {
    if (this.chart) {
      this.isZoomRangeLocked = false;
      this.timeline.min = this.timelineDataBounds.min;
      this.timeline.max = this.timelineDataBounds.max;
      if (this.timeline.min != null && this.timeline.max != null) {
        this.chart.zoomScale('timeline', { min: this.timeline.min, max: this.timeline.max }, 'zoom');
      }
    }
  }

  private updateTimelineBounds(datasets: Dataset[]) {
    this.timelineDataBounds = computeBounds('x', 0, datasets);
    if (!this.isZoomRangeLocked) {
      this.timeline.min = this.timelineDataBounds.min;
      this.timeline.max = this.timelineDataBounds.max;
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
              onZoomStart: ({ chart }) => {
                this.lockZoomRange(chart.scales['timeline']);
                return true;
              },
            },
            pan: {
              onPanStart: ({ chart }) => {
                this.lockZoomRange(chart.scales['timeline']);
                return true;
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
          tooltip: {
            callbacks: {
              beforeFooter: (context: any) => {
                const refRange = findReferenceRangeForDataset(annotations, context[0].dataset);
                if (refRange) {
                  return `Reference Range ${refRange?.yMin} - ${refRange?.yMax}`;
                }
                return '';
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
  for (let layer of layers) {
    const bounds = computeBounds('y', 0.05, layer.datasets, layer.annotations);
    layer.scale.min = bounds.min;
    layer.scale.max = bounds.max;
  }
});

function computeBounds(axis: 'x' | 'y', padding: number, datasets: Dataset[], annotations?: ChartAnnotations): Partial<NumberRange> {
  const values = datasets.flatMap((dataset) => dataset.data.map((point) => point[axis])).filter(isNotNaN);
  if (annotations) {
    const annoMin = axis === 'x' ? 'xMin' : 'yMin';
    const annoMax = axis === 'x' ? 'xMax' : 'yMax';
    values.push(...annotations.flatMap((anno) => [anno[annoMin], anno[annoMax]]).filter(isNotNaN));
  }
  if (values.length > 0) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const base = max === min ? min : max - min;
    const pad = base * padding;
    return {
      min: min - pad,
      max: max + pad,
    };
  }
  return { min: undefined, max: undefined };
}

function isNotNaN(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
