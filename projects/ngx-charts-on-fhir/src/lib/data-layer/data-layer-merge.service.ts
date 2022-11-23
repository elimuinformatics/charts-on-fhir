import { Injectable, forwardRef } from '@angular/core';
import { ChartTypeRegistry } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { omit } from 'lodash-es';
import { DataLayer, DataLayerCollection, TimelineChartType } from './data-layer';
import produce, { castDraft } from 'immer';
import { DataLayerModule } from './data-layer.module';

/**
 * Merges a [DataLayer] into the matching layer in a [DataLayerCollection].
 * Generates an ID for each layer by hashing its non-data (a.k.a. metadata) properties.
 */
@Injectable({
  providedIn: forwardRef(() => DataLayerModule),
})
export class DataLayerMergeService {
  merge(collection: DataLayerCollection, layer: DataLayer): DataLayerCollection {
    return produce(collection, (draft) => {
      const id = generateId(layer);
      if (!draft[id]) {
        draft[id] = { id, ...castDraft(layer) };
      } else {
        for (let i = 0; i < draft[id].datasets.length; i++) {
          draft[id].datasets[i].data.push(...layer.datasets[i].data);
          draft[id].datasets[i].data.sort((a, b) => a.x - b.x);
        }
      }
    });
  }
}

function generateId(layer: DataLayer): string {
  return hashCode(JSON.stringify(extractMetadata(layer))).toFixed(0);
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function extractMetadata(layer: DataLayer): MetadataLayer {
  return {
    ...layer,
    datasets: layer.datasets.map<Metadataset>((dataset) => omit(dataset, 'data') as any),
  };
}

/** DataLayer without the data */
type MetadataLayer = Omit<DataLayer, 'datasets'> & {
  datasets: Metadataset[];
};

/** Dataset without the data */
type Metadataset = DeepPartial<{ [key in TimelineChartType]: { type: key } & ChartTypeRegistry[key]['datasetOptions'] }[TimelineChartType]>;
