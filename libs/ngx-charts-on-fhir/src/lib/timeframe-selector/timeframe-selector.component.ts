import { Component } from '@angular/core';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';

@Component({
  selector: 'timeframe-selector',
  templateUrl: './timeframe-selector.component.html',
  styleUrls: ['./timeframe-selector.component.css'],
})
export class TimeFrameSelectorComponent {
  maxDate?: Date;
  minDate?: Date;

  rangeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];

  constructor(private configService: FhirChartConfigurationService) {}

  updateRangeSelector(monthCount: number) {
    this.configService.annotationSubject.next({
      type: 'line',
      borderColor: '#FF900D',
      borderWidth: 3,
      display: true,
      label: {
        display: true,
        content: `${monthCount} month ago`,
        position: 'start',
        color: '#FF900D',
        backgroundColor: '#FAFAFA',
      },
      scaleID: 'x',
      value: subtractMonths(new Date(), monthCount).getTime(),
    });
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
