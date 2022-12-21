import { ChartConfiguration, ScaleChartOptions, ScatterDataPoint } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { AnnotationOptions } from 'chartjs-plugin-annotation';

export type ChartData = ChartConfiguration['data'];
export type ChartDatasets = ChartConfiguration['data']['datasets'];
export type ChartScales = DeepPartial<ScaleChartOptions>['scales'];
export type ChartAnnotations = DeepPartial<AnnotationOptions>[];
export type ChartAnnotation = DeepPartial<AnnotationOptions>;

export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function isValidScatterDataPoint<P>(point: P): point is P & ScatterDataPoint {
  const p = point as any;
  return p != null && typeof p === 'object' && p.x != null && p.x > 0 && p.y != null && typeof p.y === 'number'; // y <= 0 is ok
}

export const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
