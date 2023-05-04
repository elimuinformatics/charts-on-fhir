import { Injectable } from '@angular/core';
import { DataLayer } from '../data-layer/data-layer';
import { MonthRange } from '../utils';
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
  summarize(layer: DataLayer, range: MonthRange): Record<string, string>[] {
    const groups = groupBy(layer.datasets, (dataset) => dataset.chartsOnFhir?.group ?? dataset.label);
    const datasets = Object.entries(groups).map(([label, ds]) => ({ ...ds[0], label, data: ds.flatMap((d) => d.data) }));
    const combined = { ...layer, datasets };
    return this.baseSummaryService.summarize(combined, range);
  }
}
