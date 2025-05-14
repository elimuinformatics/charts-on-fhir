import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { of } from 'rxjs';
import { TimelineRangeSelectorComponent } from './timeline-range-selector.component';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { SummaryRangeSelectorComponent } from '../summary-range-selector/summary-range-selector.component';
import { SummaryService } from '../fhir-chart-summary/summary.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCalendarHarness, MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { fakeAsync, tick } from '@angular/core/testing';

const max = new Date('2022-03-30T00:00').getTime();
const min = new Date('2022-01-06T00:00').getTime();

class MockConfigService {
  timelineRange$ = of({ min, max });
  zoom = jasmine.createSpy('zoom');
  resetZoom = jasmine.createSpy('resetZoom');
}

describe('TimelineRangeSelectorComponent', () => {
  let component: TimelineRangeSelectorComponent;
  let fixture: ComponentFixture<TimelineRangeSelectorComponent>;
  let element: DebugElement;
  let loader: HarnessLoader;
  let mockConfigService: MockConfigService;

  beforeEach(async () => {
    mockConfigService = new MockConfigService();
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatMenuModule,
        TimelineRangeSelectorComponent,
        SummaryRangeSelectorComponent,
      ],
      providers: [{ provide: FhirChartConfigurationService, useValue: mockConfigService }, SummaryService],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineRangeSelectorComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the range selector', () => {
    fixture.detectChanges();
    const rangeSelector = element.query(By.css('.range-selector'));
    expect(rangeSelector).toBeTruthy();
  });

  it('should support custom button with range specified in days', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    component.buttons = ['2 d'];
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ text: '2 d' }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2022-03-28T23:59:59.999');
    expect(component.selectedDateRange.start).toEqual(expectedMinDate);
  });

  it('should calculate proper 1 month ago date from max layer date', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ text: '1 mo' }));
    await ButtonInputGroup.check();
    const expectedMinDate = new Date('2022-02-28T23:59:59.999');
    expect(component.selectedDateRange.start).toEqual(expectedMinDate);
  });

  it('should calculate proper 3 month ago date from max layer date', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ text: '3 mo' }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2021-12-30T23:59:59.999');
    expect(component.selectedDateRange.start).toEqual(expectedMinDate);
  });

  it('should calculate proper 6 month ago date from max layer date', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ text: '6 mo' }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2021-09-30T23:59:59.999');
    expect(component.selectedDateRange.start).toEqual(expectedMinDate);
  });

  it('should calculate proper 12 month ago date from max layer date', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ text: '1 y' }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2021-03-30T23:59:59.999');
    expect(component.selectedDateRange.start).toEqual(expectedMinDate);
  });

  it('should reset a chart when click on all button', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ text: 'All' }));
    await ButtonInput.check();
    expect(mockConfigService.resetZoom).toHaveBeenCalled();
  });

  it('should check dateChange selected event for start date', fakeAsync(() => {
    const date: any = { value: new Date(2020, 2, 2) };
    component.dateChange(date, 'min');
    tick();
    fixture.detectChanges();
    expect(component.selectedDateRange.start).toEqual(date.value);
  }));

  it('should check dateChange selected event for end date', fakeAsync(() => {
    const date: any = { value: new Date(2020, 2, 2) };
    component.dateChange(date, 'max');
    tick();
    fixture.detectChanges();
    expect(component.selectedDateRange.end).toEqual(date.value);
  }));

  it('should check month difference between two dates', async () => {
    const componentMaxdate = new Date('2022-01-01T00:00');
    const componentMindate = new Date('2021-12-31T23:59');
    const months = component.calculateMonthDiff(componentMindate, componentMaxdate);
    expect(months).toEqual(1);
  });

  it('should subscribe timelineRange when the component initializes and set selectedDateRange', async () => {
    expect(component.selectedDateRange.start).toEqual(new Date(min));
    expect(component.selectedDateRange.end).toEqual(new Date(max));
    expect(component.selectedButton).toEqual('Custom');
  });

  it('should call configService.zoom when start date is changed', async () => {
    let rangeInput = await loader.getHarness(MatDateRangeInputHarness);
    let startInput = await rangeInput.getStartInput();
    await startInput.setValue('3/2/2020');
    expect(mockConfigService.zoom).toHaveBeenCalledWith({ min: new Date('3/2/2020').getTime(), max });
  });

  it('should call configService.zoom when end date is changed', async () => {
    let rangeInput = await loader.getHarness(MatDateRangeInputHarness);
    let endInput = await rangeInput.getEndInput();
    await endInput.setValue('3/2/2023');
    expect(mockConfigService.zoom).toHaveBeenCalledWith({ min, max: new Date('3/2/2023').getTime() });
  });

  it('should call configService.zoom when date range is entered manually in dropdown', async () => {
    const menu = await loader.getHarness(MatMenuHarness.with({ selector: '#range-selector-dropdown .mat-mdc-menu-trigger' }));
    await menu.open();
    const rangeInput = await menu.getHarness(MatDateRangeInputHarness);
    const startInput = await rangeInput.getStartInput();
    await startInput.focus();
    await startInput.setValue('3/2/2020');
    await startInput.blur();
    const endInput = await rangeInput.getEndInput();
    await endInput.focus();
    await endInput.setValue('3/2/2023');
    await endInput.blur();
    const apply = await menu.getHarness(MatButtonHarness.with({ text: 'Apply' }));
    await apply.click();
    expect(mockConfigService.zoom).toHaveBeenCalledWith({
      min: new Date('3/2/2020').getTime(),
      max: new Date('3/2/2023').getTime(),
    });
  });

  it('should call configService.zoom when range is selected on calendar', async () => {
    const menu = await loader.getHarness(MatMenuHarness.with({ selector: '#range-selector-dropdown .mat-mdc-menu-trigger' }));
    await menu.open();
    const calendar = await menu.getHarness(MatCalendarHarness);
    const monthYear = await calendar.getCurrentViewLabel();
    await calendar.selectCell({ text: '1' });
    await calendar.selectCell({ text: '22' });
    const startInput = await menu.getHarness(MatDateRangeInputHarness).then((input) => input.getStartInput());
    await startInput.focus();
    await startInput.blur();
    const endInput = await menu.getHarness(MatDateRangeInputHarness).then((input) => input.getEndInput());
    await endInput.focus();
    await endInput.blur();
    const apply = await menu.getHarness(MatButtonHarness.with({ text: 'Apply' }));
    await apply.click();
    expect(mockConfigService.zoom).toHaveBeenCalledWith({
      min: new Date(`1 ${monthYear}`).getTime(),
      max: new Date(`22 ${monthYear}`).getTime(),
    });
  });
});
