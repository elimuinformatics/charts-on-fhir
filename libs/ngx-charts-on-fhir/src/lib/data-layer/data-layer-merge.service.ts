import { Injectable } from '@angular/core';
import { DataLayer, DataLayerCollection, Dataset, ManagedDataLayer, TimelineDataPoint } from './data-layer';
import { produce, castDraft } from 'immer';
import { DataLayerColorService } from './data-layer-color.service';
import { FhirChartTagsService } from '../fhir-chart-legend/fhir-chart-tags-legend/fhir-chart-tags.service';

/**
 * Merges a `DataLayer` into the matching layer in a `DataLayerCollection`.
 * Generates an ID for each layer by hashing its non-data (a.k.a. metadata) properties.
 */
@Injectable({
  providedIn: 'root',
})
export class DataLayerMergeService {
  constructor(private colorService: DataLayerColorService, private tagsService: FhirChartTagsService) {}

  merge(collection: DataLayerCollection, layer: DataLayer): DataLayerCollection {
    return produce(collection, (draft) => {
      const id = generateId(layer);
      if (!draft[id]) {
        draft[id] = { id, ...castDraft(layer) };
      } else {
        this.mergeDatasets(draft[id], layer);
        this.mergeAnnotations(draft[id], layer);
      }
    });
  }
  /** Merge in place, matching datasets by label. This function mutates `mergedLayer` and its datasets. */
  mergeDatasets(mergedLayer: ManagedDataLayer, newLayer: DataLayer) {
    for (let newDataset of newLayer.datasets) {
      const mergedDataset = mergedLayer.datasets.find((dataset) => dataset.label === newDataset.label);
      if (mergedDataset) {
        mergedDataset.data.push(...newDataset.data);
        mergedDataset.data.sort(sortData);
      } else {
        mergedLayer.datasets.push(newDataset);
        if (mergedLayer.selected) {
          this.colorService.chooseColorsFromPalette(mergedLayer);
          this.tagsService.applyTagStyles(newDataset);
        }
      }
    }
    mergedLayer.datasets.sort((a: Dataset, b: Dataset) => {
      if (a.label && b.label) {
        return a.label.localeCompare(b.label);
      }
      return 0;
    });
  }
  /** Adds annotations from newLayer that do not already exist in the mergedLayer, matching annotations by ID. This function mutates `mergedLayer`. */
  mergeAnnotations(mergedLayer: ManagedDataLayer, newLayer: DataLayer) {
    if (!mergedLayer.annotations) {
      mergedLayer.annotations = newLayer.annotations;
    } else if (newLayer.annotations) {
      for (let newAnno of newLayer.annotations) {
        if (!mergedLayer.annotations.some((anno) => anno.id === newAnno.id)) {
          mergedLayer.annotations.push(newAnno);
        }
      }
    }
  }
}

export function sortData(a: TimelineDataPoint, b: TimelineDataPoint) {
  return (Array.isArray(a.x) ? a.x[0] : a.x) - (Array.isArray(b.x) ? b.x[0] : b.x);
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
    annotations: [],
  };
}
