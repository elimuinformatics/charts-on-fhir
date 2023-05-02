import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { DataLayerService } from '../data-layer/data-layer-manager.service';
import { SummaryService } from '../fhir-chart-summary/summary.service';
import { RangeSelectorModule } from '../range-selector/range-selector.module';
import { TimeFrameSelectorComponent } from './timeframe-selector.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { of } from 'rxjs';

type ChartAnnotation = {
  type: string;
  value: Date;
  label: {
    content: string;
  };
};

const max = new Date('2022-03-30T00:00').getTime();
const min = new Date('2022-01-06T00:00').getTime();

class MockConfigService {
  timelineRange$ = of({ min, max });
  zoom = jasmine.createSpy('zoom');
  resetZoom = jasmine.createSpy('resetZoom');
  annotationSubject = {
    next: jasmine.createSpy('next'),
  };
  summaryUpdateSubject = {
    next: jasmine.createSpy('next'),
  };
}

describe('TimeFrameSelectorComponent', () => {
  let component: TimeFrameSelectorComponent;
  let fixture: ComponentFixture<TimeFrameSelectorComponent>;
  let element: DebugElement;
  let loader: HarnessLoader;
  let mockConfigService: MockConfigService;

  beforeEach(async () => {
    mockConfigService = new MockConfigService();

    await TestBed.configureTestingModule({
      imports: [RangeSelectorModule],
      providers: [
        DataLayerService,
        SummaryService,
        { provide: FhirChartConfigurationService, useValue: mockConfigService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeFrameSelectorComponent);
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
    const timeframeSelector = element.query(By.css('.timeframe-selector'));
    expect(timeframeSelector).toBeTruthy();
  });

  it('should calculate proper 1 month ago date from max layer date and add timeframe annotations with correct time', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 mo']" }));
    await ButtonInputGroup.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    expect(component.timeframeAnnotations.length).toBe(3);
    expect(timeframeAnnotations[1].label.content).toBe('1 months ago');
    expect(timeframeAnnotations[2].label.content).toBe('2 months ago');
    const expectedMinDate = new Date('2022-02-28T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
    expect(new Date(timeframeAnnotations[1].value).getTime()).toEqual(expectedMinDate.getTime());
    expect(mockConfigService.annotationSubject.next).toHaveBeenCalledWith(timeframeAnnotations);
    expect(mockConfigService.summaryUpdateSubject.next).toHaveBeenCalledWith({
      max: new Date().getTime(),
      min: expectedMinDate.getTime(),
    });
  });

  it('should calculate proper 1 month ago date and emit correct annotations in annotationSubject and show emit correct range in summaryUpdateSubject', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 mo']" }));
    await ButtonInputGroup.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    const expectedMinDate = new Date('2022-02-28T00:00');
    expect(mockConfigService.annotationSubject.next).toHaveBeenCalledWith(timeframeAnnotations);
    expect(mockConfigService.summaryUpdateSubject.next).toHaveBeenCalledWith({
      max: new Date().getTime(),
      min: expectedMinDate.getTime(),
    });
  });

  it('should calculate proper 3 month ago date from max layer date and add timeframe annotations with correct time', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='3 mo']" }));
    await ButtonInput.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    expect(component.timeframeAnnotations.length).toBe(3);
    expect(timeframeAnnotations[1].label.content).toBe('3 months ago');
    expect(timeframeAnnotations[2].label.content).toBe('6 months ago');
    const expectedMinDate = new Date('2021-12-30T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
    expect(new Date(timeframeAnnotations[1].value).getTime()).toEqual(expectedMinDate.getTime());
  });

  it('should calculate proper 3 month ago date and emit correct annotations in annotationSubject and show emit correct range in summaryUpdateSubject', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='3 mo']" }));
    await ButtonInputGroup.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    const expectedMinDate = new Date('2021-12-30T00:00');
    expect(mockConfigService.annotationSubject.next).toHaveBeenCalledWith(timeframeAnnotations);
    expect(mockConfigService.summaryUpdateSubject.next).toHaveBeenCalledWith({
      max: new Date().getTime(),
      min: expectedMinDate.getTime(),
    });
  });

  it('should calculate proper 6 month ago date from max layer date add timeframe annotations with correct time', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='6 mo']" }));
    await ButtonInput.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    expect(component.timeframeAnnotations.length).toBe(3);
    expect(timeframeAnnotations[1].label.content).toBe('6 months ago');
    expect(timeframeAnnotations[2].label.content).toBe('12 months ago');
    const expectedMinDate = new Date('2021-09-30T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
    expect(new Date(timeframeAnnotations[1].value).getTime()).toEqual(expectedMinDate.getTime());
  });

  it('should calculate proper 6 month ago date and emit correct annotations in annotationSubject and show emit correct range in summaryUpdateSubject', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='6 mo']" }));
    await ButtonInputGroup.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    const expectedMinDate = new Date('2021-09-30T00:00');
    expect(mockConfigService.annotationSubject.next).toHaveBeenCalledWith(timeframeAnnotations);
    expect(mockConfigService.summaryUpdateSubject.next).toHaveBeenCalledWith({
      max: new Date().getTime(),
      min: expectedMinDate.getTime(),
    });
  });

  it('should calculate proper 12 month ago date from max layer date add timeframe annotations with correct time', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 y']" }));
    await ButtonInput.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    expect(component.timeframeAnnotations.length).toBe(3);
    expect(timeframeAnnotations[1].label.content).toBe('12 months ago');
    expect(timeframeAnnotations[2].label.content).toBe('24 months ago');
    const expectedMinDate = new Date('2021-03-30T00:00');
    expect(component.minDate).toEqual(expectedMinDate);
    expect(new Date(timeframeAnnotations[1].value).getTime()).toEqual(expectedMinDate.getTime());
  });

  it('should calculate proper 12 month ago date and emit correct annotations in annotationSubject and show emit correct range in summaryUpdateSubject', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='6 mo']" }));
    await ButtonInputGroup.check();
    const timeframeAnnotations: ChartAnnotation[] = component.timeframeAnnotations as ChartAnnotation[];
    const expectedMinDate = new Date('2021-09-30T00:00');
    expect(mockConfigService.annotationSubject.next).toHaveBeenCalledWith(timeframeAnnotations);
    expect(mockConfigService.summaryUpdateSubject.next).toHaveBeenCalledWith({
      max: new Date().getTime(),
      min: expectedMinDate.getTime(),
    });
  });
});
