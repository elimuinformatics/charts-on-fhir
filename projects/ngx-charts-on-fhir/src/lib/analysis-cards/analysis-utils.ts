import { ScatterDataPoint } from "chart.js";
import { DeepPartial } from "chart.js/types/utils";
import { AnnotationOptions, BoxAnnotationOptions } from "chartjs-plugin-annotation";
import { groupBy } from "lodash-es";
import { DataLayer, Dataset } from "../data-layer/data-layer";

export type ReferenceRange = {
  yMax: number;
  yMin: number;
  yScaleID: string;
};

export function isReferenceRangeFor(dataset: Dataset) {
  return function isReferenceRange(annotation: DeepPartial<AnnotationOptions>): annotation is ReferenceRange {
    return (
      (annotation as BoxAnnotationOptions)?.label?.content === `${dataset.label} Reference Range` &&
      typeof annotation.yMax === 'number' &&
      typeof annotation.yMin === 'number' &&
      typeof annotation.yScaleID === 'string'
    );
  };
}

export function computeDaysOutOfRange(layer?: DataLayer, dataset?: Dataset, data?: ScatterDataPoint[]) {
  if (!layer || !dataset || !data) {
    return undefined;
  }
  const refRange = layer?.annotations?.find(isReferenceRangeFor(dataset));
  if (refRange) {
    const days = groupByDay(data).filter((points) => points.some(isOutOfRange(refRange)));
    return days.length;
  }
  return undefined;
}

function isOutOfRange(refRange: ReferenceRange) {
  return (point: ScatterDataPoint) => point.y < refRange.yMin || refRange.yMax < point.y;
}

export function getDay(point: ScatterDataPoint): string {
  const date = new Date(point.x);
  return `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`;
}

export function groupByDay(data: ScatterDataPoint[]): ScatterDataPoint[][] {
  return Object.values(groupBy(data, getDay));
}
