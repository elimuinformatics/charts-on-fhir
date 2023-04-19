import { Injectable } from '@angular/core';
import { DataLayer, Dataset } from '../data-layer/data-layer';
import { NumberRange } from '../utils';
import { ScatterDataPointSummaryService, SummaryService } from './summary.service';
import { groupBy } from 'lodash-es';

export const HOME_DATASET_LABEL_SUFFIX = ' (Home)';
export const CLINIC_DATASET_LABEL_SUFFIX = ' (Clinic)';

/** Combines home and office measurements before summarizing */
@Injectable({
  providedIn: 'root',
})
export class HomeMeasurementSummaryService implements SummaryService {
  constructor(private baseSummaryService: ScatterDataPointSummaryService) {}

  canSummarize(layer: DataLayer): boolean {
    return this.baseSummaryService.canSummarize(layer) && layer.datasets.some((dataset) => dataset.label?.endsWith(HOME_DATASET_LABEL_SUFFIX));
  }
  summarize(layer: DataLayer, range: NumberRange): Record<string, string>[] {
    const groups = groupBy(layer.datasets, getOriginalLabel);
    const datasets = Object.entries(groups).map(([label, ds]) => ({ ...ds[0], label, data: ds.flatMap((d) => d.data) }));
    const combined = { ...layer, datasets };
    return this.baseSummaryService.summarize(combined, range);
  }
}

export function getOriginalLabel(dataset: Dataset): string | undefined {
  if (dataset.label && dataset.label.endsWith(HOME_DATASET_LABEL_SUFFIX)) {
    return dataset.label.substring(0, dataset.label.length - HOME_DATASET_LABEL_SUFFIX.length);
  }
  return dataset.label;
}
