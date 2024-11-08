import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DateRange, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { delay } from 'rxjs';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { subtractMonths } from '../utils';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

/**
 * See `*TimelineRangeSelector` for example usage.
 */
@Component({
  standalone: true,
  imports: [CommonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatMenuModule],
  selector: 'timeline-range-selector',
  templateUrl: './timeline-range-selector.component.html',
  styleUrls: ['./timeline-range-selector.component.css'],
})
export class TimelineRangeSelectorComponent {
  selectedDateRange: DateRange<Date> = new DateRange<Date>(null, null);
  calendarDateRange: DateRange<Date> = new DateRange<Date>(null, null);
  rangeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];
  selectedButton: number | 'All' = 'All';
  get selectedButtonLabel(): string {
    if (this.selectedButton === 'All') {
      return 'All';
    }
    const button = this.rangeSelectorButtons.find((b) => b.month === this.selectedButton);
    return button ? button.value : 'Custom';
  }
  @Input() showTimelineViewTitle: boolean = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef, private readonly configService: FhirChartConfigurationService) {}

  ngOnInit(): void {
    this.configService.timelineRange$.pipe(delay(0)).subscribe((timelineRange) => {
      this.selectedDateRange = new DateRange(new Date(timelineRange.min), new Date(timelineRange.max));
      if (this.configService.isAutoZoom || !this.selectedDateRange.start || !this.selectedDateRange.end) {
        this.selectedButton = 'All';
      } else {
        this.selectedButton = this.calculateMonthDiff(this.selectedDateRange.start, this.selectedDateRange.end);
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  updateRangeSelector(monthCount: number) {
    if (this.selectedDateRange.end && monthCount) {
      const maxDate = new Date();
      this.selectedDateRange = new DateRange(subtractMonths(maxDate, monthCount), maxDate);
      this.zoomChart();
    }
  }

  zoomChart() {
    if (this.selectedDateRange.start && this.selectedDateRange.end) {
      this.configService.zoom({
        min: this.selectedDateRange.start.getTime(),
        max: this.selectedDateRange.end.getTime(),
      });
    }
  }
  resetZoomChart() {
    this.configService.resetZoom();
  }

  dateChange(event: MatDatepickerInputEvent<Date>, datePickerType: string) {
    if (datePickerType === 'min') {
      this.selectedDateRange = new DateRange(event.value, this.selectedDateRange.end);
    } else {
      this.selectedDateRange = new DateRange(this.selectedDateRange.start, event.value);
    }
    this.zoomChart();
  }

  openCalendar() {
    this.calendarDateRange = this.selectedDateRange;
  }

  calendarDateChange(event: MatDatepickerInputEvent<Date>, datePickerType: string) {
    if (datePickerType === 'min') {
      this.calendarDateRange = new DateRange(event.value, this.calendarDateRange.end);
    } else {
      this.calendarDateRange = new DateRange(this.calendarDateRange.start, event.value);
    }
  }

  calendarSelectedChange(date: Date): void {
    if (this.calendarDateRange.start && date > this.calendarDateRange.start && !this.calendarDateRange.end) {
      this.calendarDateRange = new DateRange(this.calendarDateRange.start, date);
    } else {
      this.calendarDateRange = new DateRange(date, null);
    }
  }

  applyCalendarDateRange() {
    this.selectedDateRange = this.calendarDateRange;
    this.zoomChart();
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
