import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartSummaryComponent } from './fhir-chart-summary.component';
import { FhirChartLifecycleService } from '../../fhir-chart/fhir-chart-lifecycle.service';
import { Chart } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { SummaryService } from '../summary.service';
import { CommonModule } from '@angular/common';
import { FhirChartSummaryCardComponent } from '../fhir-chart-summary-card/fhir-chart-summary-card.component';

class MockLayerManager {
  enabledLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
}

class MockLifecycleService {
  afterUpdate$ = new Subject<[DeepPartial<Chart>]>();
}

class MockFhirChartConfigurationService {
  setSummaryRange = () => {};
}

@Component({
  imports: [CommonModule],
  selector: 'fhir-chart-summary-card',
})
class MockFhirChartSummaryCardComponent {
  @Input() layer: unknown;
  @Input() expanded = false;
  @Output() expand = new EventEmitter();
  @Output() collapse = new EventEmitter();
}

describe('FhirChartSummaryComponent', () => {
  let component: FhirChartSummaryComponent;
  let fixture: ComponentFixture<FhirChartSummaryComponent>;
  let layerManager: MockLayerManager;
  let lifecycleService: MockLifecycleService;
  let fhirChartConfigurationService: MockFhirChartConfigurationService;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    layerManager = new MockLayerManager();
    lifecycleService = new MockLifecycleService();
    fhirChartConfigurationService = new MockFhirChartConfigurationService();
    TestBed.overrideComponent(FhirChartSummaryComponent, {
      remove: { imports: [FhirChartSummaryCardComponent] },
      add: { imports: [MockFhirChartSummaryCardComponent] },
    });
    await TestBed.configureTestingModule({
      imports: [FhirChartSummaryComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager },
        { provide: FhirChartLifecycleService, useValue: lifecycleService },
        { provide: FhirChartConfigurationService, useValue: fhirChartConfigurationService },
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

  it('should create a grid layout from scale positions when autoAlign=true', () => {
    fixture.componentRef.setInput('autoAlign', true);
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

  it('should use implicit grid rows when autoAlign=false', () => {
    fixture.componentRef.setInput('autoAlign', false);
    layerManager.enabledLayers$.next([{ id: '1', name: 'layer 1', datasets: [], scale: { id: 'one' } }]);
    lifecycleService.afterUpdate$.next([
      {
        scales: {
          x: { axis: 'x', top: 50, bottom: 60, height: 10 },
          one: { axis: 'y', top: 10, bottom: 20, height: 10 },
        },
      },
    ]);
    fixture.detectChanges();
    const summary = fixture.debugElement.query(By.css('.chart-summary'));
    expect(summary.styles['gridTemplateRows']).toBe('');
  });

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

  it('should show backdrop when card is expanded', () => {
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
    card.componentInstance.expand.emit();
    fixture.detectChanges();
    expect(component.expandedCard).toBe('1');
    const backdrop: DebugElement = fixture.debugElement.query(By.css('.backdrop'));
    expect(backdrop).toBeDefined();
  });

  it('should collapse expanded card when backdrop is clicked', () => {
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
    component.expandedCard = '1';
    fixture.detectChanges();
    const card: DebugElement = fixture.debugElement.query(By.directive(MockFhirChartSummaryCardComponent));
    expect(card.componentInstance.expanded).toBe(true);
    const backdrop: DebugElement = fixture.debugElement.query(By.css('.backdrop'));
    backdrop.triggerEventHandler('click');
    fixture.detectChanges();
    expect(card.componentInstance.expanded).toBe(false);
  });

  it('should hide backdrop when card is collapsed', () => {
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
    component.expandedCard = '1';
    fixture.detectChanges();
    let backdrop: DebugElement = fixture.debugElement.query(By.css('.backdrop'));
    expect(backdrop).toBeTruthy();
    const card: DebugElement = fixture.debugElement.query(By.directive(MockFhirChartSummaryCardComponent));
    card.componentInstance.collapse.emit();
    fixture.detectChanges();
    backdrop = fixture.debugElement.query(By.css('.backdrop'));
    expect(backdrop).toBeNull();
  });
});
