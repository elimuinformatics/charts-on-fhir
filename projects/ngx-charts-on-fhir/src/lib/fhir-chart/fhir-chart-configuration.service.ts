import { Inject, Injectable, NgZone } from '@angular/core';
import { ChartConfiguration, ScaleOptions, CartesianScaleOptions } from 'chart.js';
import produce from 'immer';
import { mapValues, merge } from 'lodash-es';
import { map, ReplaySubject, scan, throttleTime } from 'rxjs';
import { TimelineChartType, ManagedDataLayer, Dataset, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
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
  constructor(private layerManager: DataLayerManagerService, @Inject(TIME_SCALE_OPTIONS) timeScaleOptions: ScaleOptions<'time'>, private ngZone: NgZone) {
    this.timeline = {
      ...timeScaleOptions,
      afterDataLimits: ({ max, min }) => this.ngZone.run(() => this.timelineRangeSubject.next({ max, min })),
    };
  }

  private timeline: ScaleOptions<'time'>;
  private timelineRangeSubject = new ReplaySubject<NumberRange>();
  timelineRange$ = this.timelineRangeSubject.pipe(throttleTime(100, undefined, { leading: true, trailing: true }));

  chartConfig$ = this.layerManager.selectedLayers$.pipe(
    map((layers) => this.mergeLayers(layers)),
    scan((config, layer) => this.updateConfiguration(config, layer), this.buildConfiguration())
  );

  mergeLayers(layers: ManagedDataLayer[]): MergedDataLayer {
    layers = arrangeScales(layers);
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
