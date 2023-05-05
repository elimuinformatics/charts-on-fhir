import { Injectable } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { DataLayer } from '../data-layer/data-layer';
import { MonthRange, NumberRange, formatMonthRange, previous } from '../utils';
import { groupBy } from 'lodash-es';

/** Summarizes a DataLayer, looking at data within the specified date range */
export abstract class SummaryService {
  abstract canSummarize(layer: DataLayer): boolean;
  abstract summarize(layer: DataLayer, range: NumberRange): Record<string, string>[];
}

@Injectable({
  providedIn: 'root',
})
export class ScatterDataPointSummaryService implements SummaryService {
  constructor(private stats: StatisticsService) {}

  canSummarize(layer: DataLayer): boolean {
    return layer.scale.type === 'linear';
  }
  summarize(layer: DataLayer, range: MonthRange): Record<string, string>[] {
    const groups = groupBy(layer.datasets, (dataset) => dataset.chartsOnFhir?.group ?? dataset.label);
    const datasets = Object.entries(groups).map(([label, ds]) => ({ ...ds[0], label, data: ds.flatMap((d) => d.data) }));
    layer = { ...layer, datasets };
    const current = this.stats.getFormattedStatistics(layer, range);
    const prev = this.stats.getFormattedStatistics(layer, previous(range));
    const currentLabel = `most recent ${formatMonthRange(range)}`;
    const previousLabel = `prior ${formatMonthRange(range)}`;
    const summary = Object.keys(current).map((name) => ({
      [layer.name]: name,
      [currentLabel]: current[name],
      [previousLabel]: prev[name],
    }));
    return summary;
  }
}
