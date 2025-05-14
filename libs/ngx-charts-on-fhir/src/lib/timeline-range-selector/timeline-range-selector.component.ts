import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DateRange, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { delay } from 'rxjs';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { MILLISECONDS_PER_DAY, subtractMonths } from '../utils';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

type DateRangeString = `${number} ${'y' | 'mo' | 'd'}` | 'All' | 'Custom';

/**
 * See `*TimelineRangeSelector` for example usage.
 */
@Component({
  imports: [CommonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatMenuModule],
  selector: 'timeline-range-selector',
  templateUrl: './timeline-range-selector.component.html',
  styleUrls: ['./timeline-range-selector.component.scss'],
})
export class TimelineRangeSelectorComponent {
  selectedDateRange: DateRange<Date> = new DateRange<Date>(null, null);
  calendarDateRange: DateRange<Date> = new DateRange<Date>(null, null);
  selectedButton: DateRangeString = 'All';
  @Input() showTimelineViewTitle: boolean = false;
  @Input() buttons: DateRangeString[] = ['1 mo', '3 mo', '6 mo', '1 y', 'All'];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly configService: FhirChartConfigurationService,
  ) {}

  ngOnInit(): void {
    this.configService.timelineRange$.pipe(delay(0)).subscribe((timelineRange) => {
      this.selectedDateRange = new DateRange(new Date(timelineRange.min), new Date(timelineRange.max));
      this.selectedButton = this.findMatchingButton(this.selectedDateRange);
      this.changeDetectorRef.markForCheck();
    });
  }

  updateRangeSelector(range: DateRangeString) {
    if (range === 'All') {
      this.resetZoomChart();
    }
    if (this.selectedDateRange.end && range) {
      this.selectedDateRange = this.convertStringToDateRange(range);
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
    setTimeout(() => {
      if (datePickerType === 'min') {
        this.selectedDateRange = new DateRange(event.value, this.selectedDateRange.end);
      } else {
        this.selectedDateRange = new DateRange(this.selectedDateRange.start, event.value);
      }
      this.zoomChart();
    }, 0);
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

  findMatchingButton(dateRange: DateRange<Date>) {
    if (this.configService.isAutoZoom || !dateRange.start || !dateRange.end) {
      return 'All';
    }
    const days = this.calculateDayDiff(dateRange.start, dateRange.end);
    const months = this.calculateMonthDiff(dateRange.start, dateRange.end);
    const years = Math.floor(months / 12);
    const dayString: DateRangeString = `${days} d`;
    const monthString: DateRangeString = `${months} mo`;
    const yearString: DateRangeString = `${years} y`;
    if (this.buttons.includes(dayString)) {
      return dayString;
    }
    if (this.buttons.includes(monthString)) {
      return monthString;
    }
    if (this.buttons.includes(yearString)) {
      return yearString;
    }
    return 'Custom';
  }

  convertStringToDateRange(rangeString: DateRangeString): DateRange<Date> {
    if (rangeString === 'All') {
      return new DateRange<Date>(null, null);
    }
    const maxDate = new Date();
    maxDate.setHours(23, 59, 59, 999);
    const [value, unit] = rangeString.split(' ');
    if (unit === 'y') {
      return new DateRange<Date>(subtractMonths(maxDate, parseInt(value) * 12), maxDate);
    }
    if (unit === 'mo') {
      return new DateRange<Date>(subtractMonths(maxDate, parseInt(value)), maxDate);
    }
    if (unit === 'd') {
      return new DateRange<Date>(new Date(maxDate.getTime() - parseInt(value) * MILLISECONDS_PER_DAY), maxDate);
    }
    throw new Error('Invalid range');
  }

  calculateDayDiff(minDateValue: Date, maxDateValue: Date): number {
    const diffTime = maxDateValue.getTime() - minDateValue.getTime();
    return Math.ceil(diffTime / MILLISECONDS_PER_DAY);
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
