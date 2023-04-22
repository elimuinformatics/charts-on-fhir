import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartSummaryComponent } from './fhir-chart-summary.component';
import { FhirChartLifecycleService } from '../../fhir-chart/fhir-chart-lifecycle.service';
import { Chart } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';

class MockLayerManager {
  enabledLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
}

class MockLifecycleService {
  afterUpdate$ = new Subject<[DeepPartial<Chart>]>();
}

@Component({ selector: 'fhir-chart-summary-card' })
class MockFhirChartSummaryCardComponent {
  @Input() layer: unknown;
  @Input() expanded: unknown;
}

describe('FhirChartSummaryComponent', () => {
  let component: FhirChartSummaryComponent;
  let fixture: ComponentFixture<FhirChartSummaryComponent>;
  let layerManager: MockLayerManager;
  let lifecycleService: MockLifecycleService;

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    lifecycleService = new MockLifecycleService();
    await TestBed.configureTestingModule({
      declarations: [FhirChartSummaryComponent, MockFhirChartSummaryCardComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager },
        { provide: FhirChartLifecycleService, useValue: lifecycleService },
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
    layerManager.enabledLayers$.next([
      { id: '1', name: 'layer 1', datasets: [], scale: { id: 'one' } },
      { id: '2', name: 'layer 2', datasets: [], scale: { id: 'two' } },
      { id: '3', name: 'layer 3', datasets: [], scale: { id: 'three' } },
    ]);
    lifecycleService.afterUpdate$.next([
      {
        scales: {
          x: { axis: 'x', top: 50, bottom: 60, height: 10 },
          one: { axis: 'y', top: 10, bottom: 20, height: 10 },
          two: { axis: 'y', top: 20, bottom: 40, height: 20 },
          three: { axis: 'y', top: 40, bottom: 50, height: 10 },
        },
      },
    ]);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.directive(MockFhirChartSummaryCardComponent));
    expect(cards.length).toBe(3);
  });

  it('should create a grid layout from scale positions', () => {
    layerManager.enabledLayers$.next([
      { id: '1', name: 'layer 1', datasets: [], scale: { id: 'one' } },
      { id: '2', name: 'layer 2', datasets: [], scale: { id: 'two' } },
      { id: '3', name: 'layer 3', datasets: [], scale: { id: 'three' } },
    ]);
    lifecycleService.afterUpdate$.next([
      {
        scales: {
          x: { axis: 'x', top: 50, bottom: 60, height: 10 },
          three: { axis: 'y', top: 40, bottom: 70, height: 30 },
          two: { axis: 'y', top: 20, bottom: 40, height: 20 },
          one: { axis: 'y', top: 10, bottom: 20, height: 10 },
        },
      },
    ]);
    fixture.detectChanges();
    const summary = fixture.debugElement.query(By.css('.chart-summary'));
    expect(summary.styles['gridTemplateRows']).toBe('5px 15px 25px auto');
  });

  // card sizing doesn't match order in cardio 31059

  it('should set inputs on fhir-chart-summary-card component', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    layerManager.enabledLayers$.next([layer]);
    lifecycleService.afterUpdate$.next([
      {
        scales: {
          x: { axis: 'x', top: 50, bottom: 60, height: 10 },
          test: { axis: 'y', top: 10, bottom: 20, height: 10 },
        },
      },
    ]);
    fixture.detectChanges();
    const card: DebugElement = fixture.debugElement.query(By.directive(MockFhirChartSummaryCardComponent));
    expect(card.componentInstance.layer).toEqual(layer);
    expect(card.componentInstance.expanded).toEqual(false);
  });

  it('should not render a card for disabled layers', () => {
    layerManager.enabledLayers$.next([]);
    lifecycleService.afterUpdate$.next([
      {
        scales: {
          x: { axis: 'x', top: 50, bottom: 60, height: 10 },
          test: { axis: 'y', top: 10, bottom: 20, height: 10 },
        },
      },
    ]);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.directive(MockFhirChartSummaryCardComponent));
    expect(cards.length).toBe(0);
  });

  it('should not render a card before chart updates', () => {
    const layer: ManagedDataLayer = { id: '1', name: 'layer', datasets: [{ label: 'dataset', data: [] }], scale: { id: 'test' } };
    layerManager.enabledLayers$.next([layer]);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.directive(MockFhirChartSummaryCardComponent));
    expect(cards.length).toBe(0);
  });
});
