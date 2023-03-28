import { Injectable } from '@angular/core';
import { mean, groupBy, uniq } from 'lodash-es';
import { ScatterDataPoint } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { AnnotationOptions, BoxAnnotationOptions } from 'chartjs-plugin-annotation';
import { DataLayer, Dataset } from '../data-layer/data-layer';
import { NumberRange, isValidScatterDataPoint, MILLISECONDS_PER_DAY, isDefined, ChartAnnotations } from '../utils';

type Stats = {
  days: number;
  reported: string[];
  outOfRange: string[] | null;
  average: number;
  median: number;
};

type CombinedStats = {
  days: number;
  reported: string[];
  outOfRange: string[] | null;
  average: number[];
  median: number[];
};

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  /** Get a string-formatted set of statistics for datapoints in the given `DataLayer` that fall within the given date range */
  getFormattedStatistics(layer: DataLayer, range: NumberRange): Record<string, string> {
    const datasets = layer.datasets.filter((dataset) => !dataset.hidden);
    const precision = this.estimatePrecision(datasets);
    const sortedDatasets = datasets.slice().sort(byMostRecentValue);
    const separateStats = sortedDatasets.map((dataset) => this.computeStatistics(layer, dataset, range));
    const combinedStats = this.combineStatistics(separateStats);
    return this.formatStatistics(combinedStats, precision);
  }

  /** Compute a set of statistics for points in the given dataset that fall within the given date range */
  private computeStatistics(layer: DataLayer, dataset: Dataset, range: NumberRange): Stats {
    const slice = this.filterByDateRange(dataset.data, range);
    const values = slice.data.map((point) => point.y).sort((a, b) => a - b);
    return {
      days: slice.dateRange.days,
      reported: Object.keys(groupBy(slice.data, getDay)),
      outOfRange: this.getDaysOutOfRange(layer, dataset, slice.data),
      average: mean(values),
      median: computeMedian(values),
    };
  }

  /** Aggregate statistics for multiple datasets into a single object */
  private combineStatistics(stats: Stats[]): CombinedStats {
    return {
      days: Math.max(...stats.map((stat) => stat.days)),
      reported: uniq(stats.flatMap((stat) => stat.reported)),
      outOfRange: stats.every((stat) => stat.outOfRange == null) ? null : uniq(stats.flatMap((stat) => stat.outOfRange).filter(isDefined)),
      average: stats.map((stat) => stat.average),
      median: stats.map((stat) => stat.median),
    };
  }

  /** Format a set of statistics as strings */
  private formatStatistics({ days, reported, outOfRange, average, median }: CombinedStats, precision: number) {
    return {
      'Days Reported': formatFraction(reported.length, days),
      ...(outOfRange == null ? {} : { 'Outside Goal': formatFraction(outOfRange.length, reported.length) }),
      Average: formatMultipleValues(average, precision),
      Median: formatMultipleValues(median, precision),
    };
  }

  /** Filter a data array for points that are in the given date range */
  private filterByDateRange(data: Dataset['data'], range: NumberRange) {
    return {
      data: data.filter(isValidScatterDataPoint).filter((point) => range.min <= point.x && point.x <= range.max),
      dateRange: {
        min: new Date(range.min),
        max: new Date(range.max),
        days: Math.ceil((range.max - range.min) / MILLISECONDS_PER_DAY),
      },
    };
  }

  /** Estimate the precision of a set of datasets by finding the datapoint with most digits after the decimal point */
  private estimatePrecision(datasets: Dataset[]) {
    let maxPrecision = 0;
    for (let dataset of datasets) {
      for (let point of dataset.data) {
        const yStr = String(point.y);
        const decimal = yStr.indexOf('.');
        if (decimal >= 0) {
          const precision = yStr.length - decimal - 1;
          maxPrecision = Math.max(maxPrecision, precision);
        }
      }
    }
    return maxPrecision;
  }

  /** Get an array of days from the [data] array that are outside of the reference range for the given [dataset].
   * Returns null if there is no matching reference range. */
  getDaysOutOfRange(layer: DataLayer, dataset: Dataset, data: ScatterDataPoint[]): string[] | null {
    if (layer.annotations) {
      const refRange = findReferenceRangeForDataset(layer.annotations, dataset);
      if (refRange) {
        const groups = groupBy(data, getDay);
        return Object.keys(groups).filter((day) => groups[day].some(isOutOfRange(refRange)));
      }
    }
    return null;
  }
}

/** Format a fraction of total days as "50% (1/2 days) */
function formatFraction(numerator: number, denominator: number): string {
  if (numerator == null || denominator == null || denominator === 0) {
    return 'N/A';
  }
  const percent = ((100 * numerator) / denominator).toFixed(0);
  return `${percent}% (${numerator}/${denominator} days)`;
}

/** Format multiple values as "1 / 2" */
function formatMultipleValues(values: number[], precision: number) {
  const formatted = values.map((value) => formatValue(value, precision));
  if (formatted.every((str) => str === 'N/A')) {
    return 'N/A';
  }
  return formatted.join(' / ');
}

/** Format a numeric value to the given precision */
function formatValue(value?: number | string, precision?: number): string {
  if (value == null || (typeof value === 'number' && isNaN(value))) {
    return 'N/A';
  }
  if (typeof value === 'number') {
    return value?.toLocaleString(undefined, { maximumFractionDigits: precision });
  }
  return value;
}

/** Compute the median of a pre-sorted list of values */
function computeMedian(values: number[]): number {
  const m = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[m] + values[m - 1]) / 2;
  }
  return values[m];
}

/** Comparison function that can be used to sort Datasets by their most recent y-value, descending */
export function byMostRecentValue(a: Dataset, b: Dataset) {
  const ay = a.data.at(-1)?.y;
  const by = b.data.at(-1)?.y;
  if (ay == null || by == null) {
    return 0;
  }
  if (typeof ay === 'number' && typeof by === 'number') {
    return by - ay;
  }
  return 0;
}

type ReferenceRange = {
  yMax: number;
  yMin: number;
  yScaleID: string;
};

function isOutOfRange(refRange: ReferenceRange) {
  return (point: ScatterDataPoint) => point.y < refRange.yMin || refRange.yMax < point.y;
}

function getDay(point: ScatterDataPoint): string {
  const date = new Date(point.x);
  return `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`;
}

/** Factory for generating functions that check if any given annotation is a reference range for the bound dataset */
function isReferenceRangeFor(dataset: Dataset) {
  return function isReferenceRange(annotation: DeepPartial<AnnotationOptions>): annotation is ReferenceRange {
    return (
      (annotation as BoxAnnotationOptions)?.label?.content === `${dataset.label} Reference Range` &&
      typeof annotation.yMax === 'number' &&
      typeof annotation.yMin === 'number' &&
      typeof annotation.yScaleID === 'string'
    );
  };
}

export function findReferenceRangeForDataset(annotations: ChartAnnotations, dataset: Dataset) {
  return annotations?.find(isReferenceRangeFor(dataset));
}
