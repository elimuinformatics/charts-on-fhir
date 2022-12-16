import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { VisibleData, VisibleDataService } from '../../data-layer/visible-data.service';
import { FhirChartSummaryComponent } from './fhir-chart-summary.component';

class MockVisibleDataService {
  visible$ = new BehaviorSubject<VisibleData[]>([]);
}

@Component({ selector: 'analysis-card', template: '<ng-content></ng-content>' })
class MockAnalysisCardComponent {
  @Input() dataset: unknown;
}

@Component({ selector: 'statistics', template: '' })
class MockStatisticsComponent {
  @Input() layer: unknown;
  @Input() dataset: unknown;
  @Input() visibleData: unknown;
  @Input() dateRange: unknown;
}

describe('FhirChartSummaryComponent', () => {
  let component: FhirChartSummaryComponent;
  let fixture: ComponentFixture<FhirChartSummaryComponent>;
  let visibleDataService: MockVisibleDataService;

  beforeEach(async () => {
    visibleDataService = new MockVisibleDataService();
    await TestBed.configureTestingModule({
      declarations: [FhirChartSummaryComponent, MockAnalysisCardComponent, MockStatisticsComponent],
      providers: [{ provide: VisibleDataService, useValue: visibleDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each dataset', () => {
    const emptyVisibleData: any = { layer: {}, dataset: {}, data: [], dateRange: {} };
    visibleDataService.visible$.next([emptyVisibleData, emptyVisibleData, emptyVisibleData]);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.directive(MockAnalysisCardComponent));
    expect(cards.length).toBe(3);
  });

  it('should set inputs on analysis-card component', () => {
    const visibleData: any = {
      dataset: 'dataset',
    }
    visibleDataService.visible$.next([visibleData]);
    fixture.detectChanges();
    const card: DebugElement = fixture.debugElement.query(By.directive(MockAnalysisCardComponent));
    expect(card.componentInstance.dataset).toEqual('dataset');
  });

  it('should set inputs on statistics component', () => {
    const visibleData: any = {
      layer: 'layer',
      dataset: 'dataset',
      data: 'data',
      dateRange: 'dateRange',
    };
    visibleDataService.visible$.next([visibleData]);
    fixture.detectChanges();
    const statistics: DebugElement = fixture.debugElement.query(By.directive(MockStatisticsComponent));
    expect(statistics.componentInstance.layer).toEqual('layer');
    expect(statistics.componentInstance.dataset).toEqual('dataset');
    expect(statistics.componentInstance.visibleData).toEqual('data');
    expect(statistics.componentInstance.dateRange).toEqual('dateRange');
  });
});
