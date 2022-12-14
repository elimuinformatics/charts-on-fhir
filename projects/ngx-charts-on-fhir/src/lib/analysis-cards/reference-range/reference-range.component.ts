import { Component } from '@angular/core';
import { AnalysisCardContent } from '../../analysis/analysis-card-content.component';
import { ReferenceRange, isReferenceRangeFor, computeDaysOutOfRange, groupByDay } from '../analysis-utils';

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
      const days = groupByDay(this.visibleData);
      return days.length;
    }
    return 0;
  }

  get daysOutOfRange(): number {
    if (this.layer && this.dataset) {
      if (this.referenceRange) {
        return computeDaysOutOfRange(this.layer, this.dataset, this.visibleData) ?? 0;
      }
    }
    return 0;
  }
}
