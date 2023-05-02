import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeSelectorModule } from '../range-selector/range-selector.module';
import { TimeFrameSelectorComponent } from './timeframe-selector.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';

describe('TimeFrameSelectorComponent', () => {
  let component: TimeFrameSelectorComponent;
  let fixture: ComponentFixture<TimeFrameSelectorComponent>;
  let element: DebugElement;
  let loader: HarnessLoader;
  let mockConfigService: jasmine.SpyObj<FhirChartConfigurationService>;

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj<FhirChartConfigurationService>('FhirChartConfigurationService', ['setSummaryTimeframe']);

    await TestBed.configureTestingModule({
      imports: [RangeSelectorModule],
      providers: [{ provide: FhirChartConfigurationService, useValue: mockConfigService }],
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
});
