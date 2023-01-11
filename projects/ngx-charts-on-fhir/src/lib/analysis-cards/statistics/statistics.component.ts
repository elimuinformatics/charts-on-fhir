import { Component, OnChanges } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { mean, floor, reject } from 'lodash-es';
import { AnalysisCardContent, DateRange } from '../../analysis/analysis-card-content.component';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
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
  override dateRange: DateRange;
  previousDate: Date | string;
  daysCount?: number;
  statistics: NameValuePair[] = [];
  layers?: DataLayer[];
  previousDataDates?: any[] = [];
  constructor(private layerManager: DataLayerManagerService) {
    super();

    this.previousDate = new Date();
    this.dateRange = {
      max: new Date(),
      min: new Date(),
      days: 0
    }
  }

  ngOnChanges(): void {
    this.getMaxMinDate(this.visibleData)
    this.layerManager.selectedLayers$.subscribe((layers) => {
      this.layers = layers;
      this.getPreviousDataFromLayers(this.layers, this.daysCount || 0)
    })
    this.computeStatistics(this.visibleData);
  }

  computeStatistics(data: ScatterDataPoint[]) {
    const values = data.map((point) => point.y).sort((a, b) => a - b);
    if (this.previousDataDates) {
      const previousValues = this.previousDataDates.map((point) => point.y).sort((a, b) => a - b);
      this.statistics = [
        { name: 'Summary', value: 'Current', previousValue: 'Previous' },
        { name: 'Timespan', value: `${this.dateRange?.days} days`, previousValue: `${this.dateRange?.days} days` },
        { name: 'Days Reported', value: this.daysReported(data), previousValue: this.daysReported(this.previousDataDates) },
        { name: 'Outside Goal', value: this.daysOutOfRange(data), previousValue: this.daysOutOfRange(this.previousDataDates) },
        { name: 'Average', value: mean(values), previousValue: mean(previousValues).toFixed(2) },
        { name: 'Median', value: median(values), previousValue: median(previousValues).toFixed(2) },
      ].map(({ name, value, previousValue }) => ({ name, value: format(value), previousValue }));
    }
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
  getMaxMinDate(data: any) {
    let sortedData: any[] = [];
    let xcordinates = data.map((el: any) => el.x)
    sortedData = sortedData.concat(xcordinates)
    sortedData = sortedData.sort((x: any, y: any) => {
      return x - y;
    })

    this.dateRange = {
      max: new Date(sortedData[sortedData.length - 1]),
      min: new Date(sortedData[0]),
      days: this.dateRange?.days
    }
    this.diff_months_count(this.dateRange.min, this.dateRange.max)
  }

  diff_months_count(startDate: any, endDate: any) {
    const diffTime = Math.abs(startDate - endDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.daysCount = diffDays
  }

  getPreviousDataFromLayers(layer: any, daysCount: number) {
    let data: any[] = [];
    if (layer) {
      layer.forEach((layersData: any) => {
        data.push(layersData.datasets[0].data)
      })
        this.previousDate = new Date(this.dateRange.min);
        this.previousDate.setMonth(new Date(this.dateRange.min).getDay() - Math.round(daysCount));
        data.forEach((layerData) => {
          layerData.forEach((previousData: any) => {
            if (new Date(previousData.x) < new Date(this.dateRange.min) && new Date(previousData.x) > new Date(this.previousDate)) {
              this.previousDataDates?.push(previousData)
            }
          })
        })
    }
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

