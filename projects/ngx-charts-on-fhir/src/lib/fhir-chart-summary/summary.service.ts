import { Injectable } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { DataLayer } from '../data-layer/data-layer';
import { NumberRange, previous } from '../utils';

/** Maps properties from a single resource to properties on a DataLayer */
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
    return layer.scale.type === 'linear' || layer.scale.type === "medication";
  }
  summarize(layer: DataLayer, range: NumberRange): Record<string, string>[] {
    const current = this.stats.getFormattedStatistics(layer, range);
    const prev = this.stats.getFormattedStatistics(layer, previous(range));
    const summary = Object.keys(current).map((name) => ({
      name,
      current: current[name],
      previous: prev[name],
    }));
    return summary;
  }
}
