import { Inject, Injectable } from '@angular/core';
import { ObservationReferenceRange } from 'fhir/r4';
import { merge } from 'lodash-es';
import { ChartAnnotation } from '../../utils';
import { ANNOTATION_OPTIONS, LINE_ANNOTATION_OPTIONS } from '../fhir-mapper-options';

@Injectable()
export class ReferenceRangeService {
  constructor(
    @Inject(ANNOTATION_OPTIONS) private readonly boxAnnotationOptions: ChartAnnotation,
    @Inject(LINE_ANNOTATION_OPTIONS) private readonly lineAnnotationOptions: ChartAnnotation
  ) {}

  createReferenceRangeAnnotation(range: ObservationReferenceRange, name: string, yScaleID: string): ChartAnnotation | undefined {
    const label = this.getAnnotationLabel(range, name);
    if (label) {
      if (range?.low?.value && range?.high?.value) {
        return this.createBoxAnnotation(range.high.value, range.low.value, label, yScaleID);
      } else if (range?.high?.value) {
        return this.createLineAnnotation(range.high.value, label, yScaleID);
      } else if (range?.low?.value) {
        return this.createLineAnnotation(range.low.value, label, yScaleID);
      }
    }
    return undefined;
  }

  getAnnotationLabel(range: ObservationReferenceRange | undefined, name: string): string | undefined {
    if (range?.low?.value && range?.high?.value) {
      return `${name} Reference Range`;
    } else if (range?.high?.value) {
      return `${name} Upper Limit`;
    } else if (range?.low?.value) {
      return `${name} Lower Limit`;
    }
    return undefined;
  }

  private createBoxAnnotation(high: number, low: number, label: string, yScaleID: string): ChartAnnotation {
    return merge({}, this.boxAnnotationOptions, {
      id: label,
      label: { content: label },
      yScaleID,
      yMax: high,
      yMin: low,
    });
  }

  private createLineAnnotation(value: number, label: string, scaleID: string): ChartAnnotation {
    return merge({}, this.lineAnnotationOptions, {
      id: label,
      label: { content: label },
      scaleID,
      value,
    });
  }
}
