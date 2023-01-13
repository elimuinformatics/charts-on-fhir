import { Component, Input, OnChanges } from '@angular/core';
import { mean, mapValues } from 'lodash-es';
import { DataLayer, Dataset } from '../../data-layer/data-layer';
import { DataSlice, VisibleData } from '../../data-layer/visible-data.service';
import { computeDaysOutOfRange, groupByDay } from '../analysis-utils';

type StatisticsRow = {
  name: string;
  current: string;
  previous: string;
};

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnChanges {
  @Input() visibleData?: VisibleData;

  title = 'Statistics';
  statistics: StatisticsRow[] = [];
  layer?: DataLayer;
  dataset?: Dataset;

  ngOnChanges(): void {
    if (this.visibleData) {
      this.layer = this.visibleData.layer;
      this.dataset = this.visibleData.dataset;
      const current = this.computeStatistics(this.visibleData.visible);
      const previous = this.computeStatistics(this.visibleData.previous);
      this.statistics = Object.keys(current).map((name) => ({
        name,
        current: current[name],
        previous: previous[name],
      }));
    }
  }

  computeStatistics(slice: DataSlice): Record<string, string> {
    const values = slice.data.map((point) => point.y).sort((a, b) => a - b);
    const stats = {
      Timespan: `${slice.dateRange?.days} days`,
      'Days Reported': this.daysReported(slice),
      'Outside Goal': this.daysOutOfRange(slice),
      Average: mean(values),
      Median: median(values),
    };
    return mapValues(stats, format);
  }

  daysReported({ data, dateRange }: DataSlice): string | undefined {
    const days = dateRange?.days;
    if (!days) {
      return undefined;
    }
    const reported = groupByDay(data).length;
    const pctReported = ((100 * reported) / days).toFixed(0);
    return `${pctReported}% (${reported}/${days} days)`;
  }

  daysOutOfRange({ data, dateRange }: DataSlice): string | undefined {
    const days = dateRange?.days;
    const reported = groupByDay(data).length;
    if (!days || !reported) {
      return undefined;
    }
    const outOfRange = computeDaysOutOfRange(this.layer, this.dataset, data);
    if (outOfRange == null) {
      return undefined;
    }
    const pctOutOfRange = ((100 * outOfRange) / reported).toFixed(0);
    return `${pctOutOfRange}% (${outOfRange}/${reported} days)`;
  }
}

function format(value?: number | string): string {
  if (value == null || (typeof value === 'number' && isNaN(value))) {
    return 'N/A';
  }
  if (typeof value === 'number') {
    return value?.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return value;
}

/** Compute the median of a pre-sorted list of values */
function median(values: number[]): number {
  const m = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[m] + values[m - 1]) / 2;
  }
  return values[m];
}
