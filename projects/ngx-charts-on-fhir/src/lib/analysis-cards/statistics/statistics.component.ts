import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { mean, floor, max, min } from 'lodash-es';
import { AnalysisCardContent } from '../../analysis/analysis-card-content.component';

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
      { name: 'Count', value: this.visibleData.length },
      { name: 'Average', value: mean(values) },
      { name: 'Median', value: median(values) },
      { name: 'Maximum', value: max(values) },
      { name: 'Minimum', value: min(values) },
    ].map(({ name, value }) => ({ name, value: format(value) }));
  }
}

function format(value?: number | string): string {
  if (!value) {
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
