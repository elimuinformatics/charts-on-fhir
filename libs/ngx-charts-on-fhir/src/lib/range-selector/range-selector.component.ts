import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { delay } from 'rxjs';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';

/**
 * See `*RangeSelector` for example usage.
 */
@Component({
  selector: 'range-selector',
  templateUrl: './range-selector.component.html',
  styleUrls: ['./range-selector.component.css'],
})
export class RangeSelectorComponent {
  maxDate?: Date;
  minDate?: Date;

  rangeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];
  selectedButton: number | 'All' = 'All';

  constructor(private configService: FhirChartConfigurationService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.configService.timelineRange$.pipe(delay(0)).subscribe((timelineRange) => {
      this.maxDate = new Date(timelineRange.max);
      this.minDate = new Date(timelineRange.min);
      if (this.configService.isAutoZoom) {
        this.selectedButton = 'All';
      } else {
        this.selectedButton = this.calculateMonthDiff(this.minDate, this.maxDate);
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  updateRangeSelector(monthCount: number) {
    if (this.maxDate && monthCount) {
      this.minDate = subtractMonths(this.maxDate, monthCount);
      this.configService.zoom({
        min: this.minDate.getTime(),
        max: this.maxDate.getTime(),
      });
    }
  }

  resetZoomChart() {
    this.configService.resetZoom();
  }

  dateChange(event: MatDatepickerInputEvent<Date>, datePickerType: string) {
    if (event.value) {
      if (datePickerType === 'min') {
        this.minDate = event.value;
      } else {
        this.maxDate = event.value;
      }
      if (this.minDate && this.maxDate) {
        this.configService.zoom({
          min: this.minDate.getTime(),
          max: this.maxDate.getTime(),
        });
      }
    }
  }
  calculateMonthDiff(minDateValue: Date, maxDateValue: Date): number {
    let months = (maxDateValue.getFullYear() - minDateValue.getFullYear()) * 12;
    months -= minDateValue.getMonth();
    months += maxDateValue.getMonth();
    if (months) {
      return months;
    }
    return 0;
  }
}

function subtractMonths(oldDate: Date, months: number): Date {
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
