import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { delay } from 'rxjs';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { subtractMonths } from '../utils';

/**
 * See `*RangeSelector` for example usage.
 */
@Component({
  selector: 'timeline-range-selector',
  templateUrl: './timeline-range-selector.component.html',
  styleUrls: ['./timeline-range-selector.component.css'],
})
export class TimelineRangeSelectorComponent {
  maxDate?: Date;
  minDate?: Date;
  rangeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];
  selectedButton: number | 'All' = 'All';

  constructor(private changeDetectorRef: ChangeDetectorRef, private configService: FhirChartConfigurationService) {}

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
      this.maxDate = new Date();
      this.minDate = subtractMonths(this.maxDate, monthCount);
      this.configService.zoom({
        min: this.minDate.getTime(),
        max: new Date().getTime(),
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
