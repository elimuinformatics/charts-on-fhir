import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryRangeSelectorModule } from './summary-range-selector.module';
import { SummaryRangeSelectorComponent } from './summary-range-selector.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { of } from 'rxjs';

describe('SummaryRangeSelectorComponent', () => {
  let component: SummaryRangeSelectorComponent;
  let fixture: ComponentFixture<SummaryRangeSelectorComponent>;
  let element: DebugElement;
  let loader: HarnessLoader;
  let mockConfigService: jasmine.SpyObj<FhirChartConfigurationService>;
  let mockLayerManager: jasmine.SpyObj<DataLayerManagerService>;

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj<FhirChartConfigurationService>('FhirChartConfigurationService', ['setSummaryRange']);
    mockLayerManager = jasmine.createSpyObj<DataLayerManagerService>('DataLayerManagerService', [], {
      enabledLayers$: of([{ name: 'Layer' } as any]),
    });

    await TestBed.configureTestingModule({
      imports: [SummaryRangeSelectorModule],
      providers: [
        { provide: FhirChartConfigurationService, useValue: mockConfigService },
        { provide: DataLayerManagerService, useValue: mockLayerManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryRangeSelectorComponent);
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
    const summaryRangeSelector = element.query(By.css('.summary-range-selector'));
    expect(summaryRangeSelector).toBeTruthy();
  });
});
