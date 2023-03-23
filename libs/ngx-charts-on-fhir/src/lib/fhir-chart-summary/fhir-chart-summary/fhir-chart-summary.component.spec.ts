import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, map } from 'rxjs';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { NumberRange } from '../../utils';
import { SummaryService } from '../summary.service';
import { FhirChartSummaryComponent } from './fhir-chart-summary.component';

class MockLayerManager {
  enabledLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
}

class MockConfigService {
  timelineRange$ = new BehaviorSubject<NumberRange>({ min: 0, max: 10 });
}

@Component({ selector: 'fhir-chart-summary-card', template: '<ng-content></ng-content>' })
class MockFhirChartSummaryCardComponent {
  @Input() title: unknown;
  @Input() color: unknown;
}

@Component({ selector: 'dynamic-table', template: '' })
class MockDynamicTableComponent {
  @Input() data: Record<string, string>[] = [];
}

describe('FhirChartSummaryComponent', () => {
  let component: FhirChartSummaryComponent;
  let fixture: ComponentFixture<FhirChartSummaryComponent>;
  let layerManager: MockLayerManager;
  let configService: MockConfigService;
  let summaryService: jasmine.SpyObj<SummaryService>;
  let colorService: jasmine.SpyObj<DataLayerColorService>;

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    configService = new MockConfigService();
    summaryService = jasmine.createSpyObj('SummaryService', ['canSummarize', 'summarize']);
    summaryService.canSummarize.and.returnValue(true);
    summaryService.summarize.and.returnValue([{ name: 'summary' }]);
    colorService = jasmine.createSpyObj('ColorService', ['getColorGradient']);
    await TestBed.configureTestingModule({
      declarations: [FhirChartSummaryComponent, MockFhirChartSummaryCardComponent, MockDynamicTableComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager },
        { provide: FhirChartConfigurationService, useValue: configService },
        { provide: SummaryService, useValue: summaryService, multi: true },
        { provide: DataLayerColorService, useValue: colorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each layer', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [], scale: { id: 'test' } };
    layerManager.enabledLayers$.next([layer, layer, layer]);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.directive(MockFhirChartSummaryCardComponent));
    expect(cards.length).toBe(3);
  });

  it('should set inputs on fhir-chart-summary-card component', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    layerManager.enabledLayers$.next([layer]);
    fixture.detectChanges();
    const card: DebugElement = fixture.debugElement.query(By.directive(MockFhirChartSummaryCardComponent));
    expect(card.componentInstance.title).toEqual('layer');
  });

  it('should set inputs on dynamic-table component', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    layerManager.enabledLayers$.next([layer]);
    fixture.detectChanges();
    const statistics: DebugElement = fixture.debugElement.query(By.directive(MockDynamicTableComponent));
    expect(statistics.componentInstance.data).toEqual([{ name: 'summary' }]);
  });
  it('should not render a card for disabled layers', () => {
    layerManager.enabledLayers$.next([]);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.directive(MockFhirChartSummaryCardComponent));
    expect(cards.length).toBe(0);
  });
});
