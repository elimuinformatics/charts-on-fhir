import { Component } from '@angular/core';
import { ScatterDataPoint } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { AnnotationOptions, BoxAnnotationOptions } from 'chartjs-plugin-annotation';
import { groupBy } from 'lodash-es';
import { AnalysisCardContent } from '../../analysis/analysis-card-content.component';
import { Dataset } from '../../data-layer/data-layer';

type ReferenceRange = {
  yMax: number;
  yMin: number;
  yScaleID: string;
};

@Component({
  selector: 'reference-range',
  templateUrl: './reference-range.component.html',
  styleUrls: ['./reference-range.component.css'],
})
export class ReferenceRangeComponent extends AnalysisCardContent {
  override icon = 'warning';

  override get priority(): number {
    if (this.daysOutOfRange > 0) {
      return 10;
    }
    return 0;
  }

  get referenceRange(): ReferenceRange | undefined {
    if (this.dataset) {
      return this.layer?.annotations?.find(isReferenceRangeFor(this.dataset));
    }
    return undefined;
  }

  get daysWithObservations(): number {
    if (this.dataset) {
      const days = Object.values(groupBy(this.visibleData, getDay));
      return days.length;
    }
    return 0;
  }

  get daysOutOfRange(): number {
    if (this.layer && this.dataset) {
      if (this.referenceRange) {
        return computeDaysOutOfRange(this.visibleData, this.referenceRange);
      }
    }
    return 0;
  }
}

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

function computeDaysOutOfRange(data: ScatterDataPoint[], refRange: ReferenceRange) {
  const isOutOfRange = (point: ScatterDataPoint) => point.y < refRange.yMin || refRange.yMax < point.y;
  const days = Object.values(groupBy(data, getDay)).filter((points) => points.some(isOutOfRange));
  return days.length;
}

function getDay(point: ScatterDataPoint): string {
  const date = new Date(point.x);
  return `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`;
}
