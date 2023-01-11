import { Injectable, forwardRef } from '@angular/core';
import { DataLayer, DataLayerCollection } from './data-layer';
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
        mergeDatasets(draft[id], layer);
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

function extractMetadata(layer: DataLayer): DataLayer {
  return {
    ...layer,
    datasets: [],
  };
}

/** Merge in place, matching datasets by label. This function mutates `mergedLayer` and its datasets. */
function mergeDatasets(mergedLayer: DataLayer, newLayer: DataLayer) {
  for (let newDataset of newLayer.datasets) {
    const mergedDataset = mergedLayer.datasets.find((dataset) => dataset.label === newDataset.label);
    if (mergedDataset) {
      mergedDataset.data.push(...newDataset.data);
      mergedDataset.data.sort((a, b) => a.x - b.x);
    } else {
      mergedLayer.datasets.push(newDataset);
    }
  }
}
