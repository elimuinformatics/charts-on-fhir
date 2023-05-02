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

const max = new Date('2022-03-30T00:00').getTime();
const min = new Date('2022-01-06T00:00').getTime();

class MockConfigService {
  timelineRange$ = of({ min, max });
  zoom = jasmine.createSpy('zoom');
  resetZoom = jasmine.createSpy('resetZoom');
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
    const rangeSelector = element.query(By.css('.timeframe-selector'));
    expect(rangeSelector).toBeTruthy();
  });

  it('should calculate proper 1 month ago date from max layer date', async () => {
    jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 mo']" }));
    await ButtonInputGroup.check();
    const expectedMinDate = new Date('2022-02-28T00:00');
    expect(component.timeframeAnnotations.length).toBe(3);
    expect(component.timeframeAnnotations[1].label.content).toBe('1 month ago');
    expect(component.timeframeAnnotations[2].label.content).toBe('2 months ago');
    // component.timeframeAnnotations.forEach((annotation: ) => {
    //   expect(annotation.value).toEqual('expectedValue');
    // });

    // expect(component.timeframeAnnotations).toEqual(jasmine.arrayContaining([]));
  });

  // it('should calculate proper 3 month ago date from max layer date', async () => {
  //   jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
  //   let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='3 mo']" }));
  //   await ButtonInput.check();
  //   const expectedMinDate = new Date('2021-12-30T00:00');
  //   expect(component.minDate).toEqual(expectedMinDate);
  // });

  // it('should calculate proper 6 month ago date from max layer date', async () => {
  //   jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
  //   let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='6 mo']" }));
  //   await ButtonInput.check();
  //   const expectedMinDate = new Date('2021-09-30T00:00');
  //   expect(component.minDate).toEqual(expectedMinDate);
  // });

  // it('should calculate proper 12 month ago date from max layer date', async () => {
  //   jasmine.clock().mockDate(new Date('2022-03-30T00:00'));
  //   let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 y']" }));
  //   await ButtonInput.check();
  //   const expectedMinDate = new Date('2021-03-30T00:00');
  //   expect(component.minDate).toEqual(expectedMinDate);
  // });
});
