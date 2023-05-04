import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataLayerColorService, COLOR_PALETTE } from '../../data-layer/data-layer-color.service';
import { FhirChartSummaryCardComponent } from './fhir-chart-summary-card.component';
import { Component, Input, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { BehaviorSubject } from 'rxjs';
import { NumberRange } from '../../utils';
import { SummaryService } from '../summary.service';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

class MockConfigService {
  summaryRange$ = new BehaviorSubject<NumberRange>({ min: 0, max: 10 });
}

@Component({ selector: 'dynamic-table', template: '' })
class MockDynamicTableComponent {
  @Input() data: Record<string, string>[] = [];
}

describe('FhirChartSummaryCardComponent', () => {
  let component: FhirChartSummaryCardComponent;
  let fixture: ComponentFixture<FhirChartSummaryCardComponent>;
  let configService: MockConfigService;
  let colorService: jasmine.SpyObj<DataLayerColorService>;
  let summaryService: jasmine.SpyObj<SummaryService>;

  beforeEach(async () => {
    configService = new MockConfigService();
    summaryService = jasmine.createSpyObj('SummaryService', ['canSummarize', 'summarize']);
    summaryService.canSummarize.and.returnValue(true);
    summaryService.summarize.and.returnValue([{ name: 'summary' }]);
    colorService = jasmine.createSpyObj('ColorService', ['getColorGradient']);
    await TestBed.configureTestingModule({
      declarations: [FhirChartSummaryCardComponent, MockDynamicTableComponent],
      imports: [MatTooltipModule, OverlayModule],
      providers: [
        { provide: FhirChartConfigurationService, useValue: configService },
        { provide: SummaryService, useValue: summaryService, multi: true },
        { provide: DataLayerColorService, useValue: colorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set inputs on dynamic-table component', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    component.layer = layer;
    fixture.detectChanges();
    const statistics: DebugElement = fixture.debugElement.query(By.directive(MockDynamicTableComponent));
    expect(statistics.componentInstance.data).toEqual([{ name: 'summary' }]);
  });

  it('should show overlay when card is expanded', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    component.layer = layer;
    component.expanded = true;
    fixture.detectChanges();
    const overlay: DebugElement = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).toBeDefined();
  });

  it('should hide overlay when card is collapsed', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    component.layer = layer;
    component.expanded = false;
    fixture.detectChanges();
    const overlay: DebugElement = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).toBeNull();
  });
});
