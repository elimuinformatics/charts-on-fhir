import { Component, OnChanges } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { mean, floor } from 'lodash-es';
import { AnalysisCardContent } from '../../analysis/analysis-card-content.component';
import { computeDaysOutOfRange, groupByDay } from '../analysis-utils';

type NameValuePair = {
  name: string;
  value: string;
};

@Component({
  selector: 'statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent extends AnalysisCardContent implements OnChanges {
  override title = 'Statistics';
  override get priority() {
    if (this.visibleData.length <= 1) {
      return 0;
    }
    return 5;
  }

  statistics: NameValuePair[] = [];

  ngOnChanges(): void {
    this.computeStatistics(this.visibleData);
  }

  computeStatistics(data: ScatterDataPoint[]) {
    const values = data.map((point) => point.y).sort((a, b) => a - b);
    this.statistics = [
      { name: 'Timespan', value: `${this.dateRange?.days} days` },
      { name: 'Days Reported', value: this.daysReported(data) },
      { name: 'Outside Goal', value: this.daysOutOfRange(data) },
      { name: 'Average', value: mean(values) },
      { name: 'Median', value: median(values) },
    ].map(({ name, value }) => ({ name, value: format(value) }));
  }

  daysReported(data: ScatterDataPoint[]): string | undefined {
    const days = this.dateRange?.days;
    if (!days) {
      return undefined;
    }
    const reported = groupByDay(data).length;
    const pctReported = ((100 * reported) / days).toFixed(0);
    return `${pctReported}% (${reported}/${days} days)`;
  }

  daysOutOfRange(data: ScatterDataPoint[]): string | undefined {
    const days = this.dateRange?.days;
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
  if (value == null) {
    return 'N/A';
  }
  if (typeof value === 'number') {
    return value?.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return value;
}

/** Compute the median of a pre-sorted list of values */
function median(values: number[]): number {
  const m = floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[m] + values[m - 1]) / 2;
  }
  return values[m];
}
