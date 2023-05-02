import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { TIMEFRAME_ANNOTATIONS } from '../fhir-mappers/fhir-mapper-options';
import { delay } from 'rxjs';
import { ChartAnnotation } from '../utils';

@Component({
  selector: 'timeframe-selector',
  templateUrl: './timeframe-selector.component.html',
  styleUrls: ['./timeframe-selector.component.css'],
})
export class TimeFrameSelectorComponent {
  maxDate?: Date;
  minDate?: Date;

  timeframeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private configService: FhirChartConfigurationService,
    @Inject(TIMEFRAME_ANNOTATIONS) public timeframeAnnotations: ChartAnnotation[]
  ) {}

  ngOnInit(): void {
    this.configService.timelineRange$.pipe(delay(0)).subscribe((timelineRange) => {
      this.maxDate = new Date(timelineRange.max);
      this.minDate = new Date(timelineRange.min);
    });
  }

  updateTimeframeRangeSelector(monthCount: number) {
    if (this.maxDate && monthCount) {
      const previouMonth = monthCount * 2;
      // remove all previous annotions except TODAY
      this.timeframeAnnotations.splice(1);
      for (let i = 0; i < 2; i++) {
        this.timeframeAnnotations.push({
          type: 'line',
          borderColor: '#FF900D',
          borderWidth: 3,
          display: true,
          label: {
            display: true,
            content: i === 0 ? `${monthCount} months ago` : `${previouMonth} months ago`,
            position: 'start',
            color: '#FF900D',
            backgroundColor: '#FAFAFA',
          },
          scaleID: 'x',
          value: i === 0 ? subtractMonths(new Date(), monthCount).getTime() : subtractMonths(new Date(), previouMonth).getTime(),
        });
      }
      this.configService.annotationSubject.next(this.timeframeAnnotations);
      this.maxDate = new Date();
      this.minDate = subtractMonths(this.maxDate, monthCount);
      this.configService.summaryUpdateSubject.next({
        max: new Date().getTime(),
        min: this.minDate.getTime(),
      });
    }
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
