import { Injectable } from '@angular/core';
import { ChartConfiguration, ScaleOptions, CartesianScaleOptions } from 'chart.js';
import produce from 'immer';
import { mapValues, merge } from 'lodash-es';
import { map, scan } from 'rxjs';
import { TimelineChartType, ManagedDataLayer, DataLayer, Dataset, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { ChartAnnotation, ChartAnnotations, ChartScales, isDefined } from '../utils';

type TimelineConfiguration = ChartConfiguration<TimelineChartType, TimelineDataPoint[]>;

/** Builds a ChartConfiguration object from a DataLayerManager's selected layers */
@Injectable()
export class FhirChartConfigurationService {
  constructor(private layerManager: DataLayerManagerService) {}
  chartConfig$ = this.layerManager.selectedLayers$.pipe(
    map((layers) => mergeLayers(layers)),
    scan((config, layer) => updateConfiguration(config, layer), buildConfiguration())
  );
}

function mergeLayers(layers: ManagedDataLayer[]): DataLayer {
  layers = arrangeScales(layers);
  const enabledLayers = layers.filter((layer) => layer.enabled);
  const datasets = enabledLayers.flatMap((layer) => layer.datasets);
  const scales = Object.assign({}, ...enabledLayers.map((layer) => ({ ...layer.scales })));
  const annotations = enabledLayers.flatMap((layer) => layer.annotations).filter(isDefined);
  return { datasets, scales, annotations, name: '' };
}

function updateConfiguration(config: TimelineConfiguration, layer: DataLayer): TimelineConfiguration {
  const datasets = layer.datasets.map((dataset) => merge(findDataset(config, dataset), dataset));
  const scales = mapValues(layer.scales, (scale, key) => merge(findScale(config, key), scale));
  const annotations = layer.annotations?.map((anno) => merge(findAnnotation(config, anno), anno)) ?? [];
  return buildConfiguration(datasets, scales, annotations);
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

/** Build a chart configuration object to display the given datasets, scales, and annotations */
function buildConfiguration(datasets: Dataset[] = [], scales: ChartScales = {}, annotations: ChartAnnotations = []): TimelineConfiguration {
  return {
    type: 'line',
    data: {
      datasets,
    },
    options: {
      scales,
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

/** Arrange stacked scales in the same order as the layers array by modifying the `weight` option for each scale */
const arrangeScales = produce((layers: ManagedDataLayer[]) => {
  for (let i = 0; i < layers.length; i++) {
    Object.values(layers[i].scales ?? {})
      .filter(isStackedScale)
      .forEach((scale) => {
        // weight determines the vertical order in the stack, starting from the origin
        scale.weight = layers.length - i;
      });
  }
});

function isStackedScale(scale: ScaleOptions | undefined): scale is CartesianScaleOptions {
  return !!(scale && (scale as CartesianScaleOptions).stack);
}
