import { CartesianScaleOptions, ChartConfiguration, CoreScaleOptions, Scale, ScaleChartOptions, ScatterDataPoint } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { AnnotationOptions } from 'chartjs-plugin-annotation';

export type MonthRange = NumberRange & { months?: number };
export type NumberRange = { min: number; max: number };
export function previous({ min, max }: NumberRange): NumberRange {
  return {
    max: min - 1,
    min: min - 1 - (max - min),
  };
}

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

export function isCartesianScale(scale: Scale<CoreScaleOptions>): scale is Scale<CartesianScaleOptions> {
  return scale.type === 'linear' || scale.type === 'logarithmic' || scale.type === 'category';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format a date using Elimu standard date format "d MMM yyyy" */
export function formatDate(date: string | number | Date): string {
  date = new Date(date);
  const d = date.getDate();
  const MMM = MONTHS[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${d} ${MMM} ${yyyy}`;
}
export function formatTime(date: string | number | Date): string {
  date = new Date(date);
  let h = date.getHours();
  let mm = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${mm} ${ampm}`;
}
export function formatDateTime(date: string | number | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function subtractMonths(oldDate: Date, months: number): Date {
  const newDate = new Date(oldDate);
  newDate.setMonth(oldDate.getMonth() - months);
  // If day-of-the-month (getDate) has changed, it's because the day did not exist
  // in the new month (e.g.Feb 30) so setMonth rolled over into the next month.
  // We can fix this by setting day-of-month to 0, so it rolls back to last day of previous month.
  if (newDate.getDate() < oldDate.getDate()) {
    newDate.setDate(0);
  }
  return newDate;
}

export function formatMonths(months: number): string {
  if (months % 12 === 0) {
    return `${months / 12} ${months === 12 ? 'year' : 'years'}`;
  }
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

export function formatDays(range: NumberRange) {
  const days = Math.floor((range.max - range.min) / MILLISECONDS_PER_DAY);
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export function formatMonthRange(range: MonthRange) {
  if (range.months) {
    return formatMonths(range.months);
  } else {
    return formatDays(range);
  }
}

export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
