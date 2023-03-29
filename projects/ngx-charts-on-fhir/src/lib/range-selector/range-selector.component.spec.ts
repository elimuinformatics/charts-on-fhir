import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { of } from 'rxjs';
import { RangeSelectorComponent } from './range-selector.component';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';

const max = new Date('2022-03-30T00:00').getTime();
const min = new Date('2022-01-06T00:00').getTime();

class MockConfigService {
  timelineRange$ = of({ min, max });
  zoom = jasmine.createSpy('zoom');
  resetZoom = jasmine.createSpy('resetZoom');
}

fdescribe('RangeSelectorComponent', () => {
  let component: RangeSelectorComponent;
  let fixture: ComponentFixture<RangeSelectorComponent>;
  let element: DebugElement;
  let loader: HarnessLoader;
  let mockConfigService: MockConfigService;

  beforeEach(async () => {
    mockConfigService = new MockConfigService();
    await TestBed.configureTestingModule({
      imports: [MatButtonToggleModule, MatInputModule, FormsModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule],
      declarations: [RangeSelectorComponent],
      providers: [{ provide: FhirChartConfigurationService, useValue: mockConfigService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeSelectorComponent);
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

  it('should calculate proper 1 month ago date from max layer date', async () => {
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 mo']" }));
    await ButtonInputGroup.check();
    const expectedMinDate = new Date('2022-02-28T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 3 month ago date from max layer date', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='3 mo']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2021-12-30T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 6 month ago date from max layer date', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='6 mo']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2021-09-30T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 12 month ago date from max layer date', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 y']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date('2021-03-30T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should reset a chart when click on all button', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='resetzoom']" }));
    await ButtonInput.check();
    expect(mockConfigService.resetZoom).toHaveBeenCalled();
  });

  it('should check dateChange selected event for start date', () => {
    const date: any = { value: new Date(2020, 2, 2) };
    component.dateChange(date, 'min');
    fixture.detectChanges();
    expect(component.minDate).toEqual(date.value);
  });

  it('should check dateChange selected event for end date', () => {
    const date: any = { value: new Date(2020, 2, 2) };
    component.dateChange(date, 'max');
    fixture.detectChanges();
    expect(component.maxDate).toEqual(date.value);
  });

  it('should check month difference between two dates', async () => {
    const componentMaxdate = new Date('2022-01-01T00:00');
    const componentMindate = new Date('2021-12-31T23:59');
    const months = component.calculateMonthDiff(componentMindate, componentMaxdate);
    expect(months).toEqual(1);
  });

  it('should subscribe timelineRange when the component initializes and set minDate and maxDate', async () => {
    expect(component.minDate).toEqual(new Date(min));
    expect(component.maxDate).toEqual(new Date(max));
    expect(component.selectedButton).toEqual(2);
  });
});
