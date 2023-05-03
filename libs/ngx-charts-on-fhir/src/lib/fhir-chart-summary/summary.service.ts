import { Injectable } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { DataLayer } from '../data-layer/data-layer';
import { MonthRange, NumberRange, formatDateRange, formatMonthRange, previous } from '../utils';

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
    const current = this.stats.getFormattedStatistics(layer, range);
    const prev = this.stats.getFormattedStatistics(layer, previous(range));
    const currentLabel = range.months ? formatMonthRange(range.months, 0) : formatDateRange(range);
    const previousLabel = range.months ? formatMonthRange(range.months * 2, range.months) : formatDateRange(previous(range));
    const summary = Object.keys(current).map((name) => ({
      [layer.name]: name,
      [currentLabel]: current[name],
      [previousLabel]: prev[name],
    }));
    return summary;
  }
}
