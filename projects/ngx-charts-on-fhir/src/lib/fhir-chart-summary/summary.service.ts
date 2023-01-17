import { Injectable } from '@angular/core';
import { StatisticsService } from './statistics.service';
import { DataLayer } from '../data-layer/data-layer';
import { formatDate, NumberRange, previous } from '../utils';


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
    return layer.scale.type === 'linear';
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

@Injectable({
  providedIn: 'root',
})
export class MedicationSummaryService implements SummaryService {
  constructor(private stats: StatisticsService) {}

  canSummarize(layer: DataLayer): boolean {
    return layer.scale.type === 'medication';
  }
  summarize(layer: DataLayer): Record<string, string>[] {
    return layer.datasets.map(dataset => ({
      name: dataset.label ?? '(unknown)',
      'Date Written': formatDate(new Date(dataset.data[0].x)), // TODO: find most recent authoredOn date
    }));
  }
}



