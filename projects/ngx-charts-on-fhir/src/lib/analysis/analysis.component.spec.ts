import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ManagedDataLayer } from '../data-layer/data-layer';
import { DataLayerColorService } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { MILLISECONDS_PER_DAY } from '../utils';
import { AnalysisCardContent } from './analysis-card-content.component';

import { AnalysisComponent, ANALYSIS_CARDS } from './analysis.component';
import { AnalysisModule } from './analysis.module';

@Component({})
class MockCard extends AnalysisCardContent {
  override title = 'Mock Title';
  override icon = 'mock_icon';
}

@Component({})
class MockCardHighPriority extends AnalysisCardContent {
  override title = 'High Priority';
  override get priority() {
    return 100;
  }
}

@Component({})
class MockCardHidden extends AnalysisCardContent {
  override title = 'Hidden';
  override get priority() {
    return 0;
  }
}

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

class MockLayerManager {
  selectedLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
  timelineRange$ = new ReplaySubject<{ min: number; max: number }>();
}

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;
  let layerManager: MockLayerManager;
  let cards: Type<AnalysisCardContent>[];

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    cards = [];

    await TestBed.configureTestingModule({
      imports: [AnalysisModule],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager },
        { provide: ANALYSIS_CARDS, useValue: cards },
        { provide: DataLayerColorService, useValue: mockColorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each dataset', () => {
    cards.push(MockCard);
    layerManager.selectedLayers$.next([
      {
        id: '1',
        name: 'Layer',
        datasets: [
          { label: 'one', data: [] },
          { label: 'two', data: [] },
        ],
        scales: {},
      },
    ]);
    const cardsContainer: HTMLElement = fixture.debugElement.query(By.css('.analysis-cards')).nativeElement;
    expect(cardsContainer.childElementCount).toBe(2);
  });

  it('cards should be ordered by priority', () => {
    cards.push(MockCard, MockCardHighPriority);
    layerManager.selectedLayers$.next([
      {
        id: '1',
        name: 'Layer',
        datasets: [{ label: 'one', data: [] }],
        scales: {},
      },
    ]);
    const cardInstances: AnalysisCardContent[] = fixture.debugElement
      .query(By.css('.analysis-cards'))
      .children.map((debugElement) => debugElement.componentInstance);
    const titles = cardInstances.map((card) => card.title);
    expect(titles).toEqual(['High Priority', 'Mock Title']);
  });

  it('cards with zero priority should be hidden', () => {
    cards.push(MockCardHidden);
    layerManager.selectedLayers$.next([
      {
        id: '1',
        name: 'Layer',
        datasets: [{ label: 'one', data: [] }],
        scales: {},
      },
    ]);
    const cardsContainer: HTMLElement = fixture.debugElement.query(By.css('.analysis-cards')).nativeElement;
    expect(cardsContainer.childElementCount).toBe(0);
  });

  it('should get title from card content', () => {
    cards.push(MockCard);
    const layer = {
      id: '1',
      name: 'Layer',
      datasets: [{ label: 'one', data: [] }],
      scales: {},
    };
    layerManager.selectedLayers$.next([layer]);
    fixture.detectChanges();
    const cardTitle: HTMLElement = fixture.debugElement.query(By.css('.analysis-card-title')).nativeElement;
    expect(cardTitle.innerHTML).toBe('Mock Title');
  });

  it('should get icon from card content', () => {
    cards.push(MockCard);
    const layer = {
      id: '1',
      name: 'Layer',
      datasets: [{ label: 'one', data: [] }],
      scales: {},
    };
    layerManager.selectedLayers$.next([layer]);
    fixture.detectChanges();
    const cardIcon: HTMLElement = fixture.debugElement.query(By.css('.analysis-card-icon')).nativeElement;
    expect(cardIcon.innerHTML).toBe('mock_icon');
  });

  it('should set layer input on each card', () => {
    cards.push(MockCard);
    const layer = {
      id: '1',
      name: 'Layer',
      datasets: [{ label: 'one', data: [] }],
      scales: {},
    };
    layerManager.selectedLayers$.next([layer]);
    const cardContent: MockCard = fixture.debugElement.query(By.directive(MockCard)).componentInstance;
    expect(cardContent.layer).toBe(layer);
  });

  it('should set dataset input on each card', () => {
    cards.push(MockCard);
    const layer = {
      id: '1',
      name: 'Layer',
      datasets: [{ label: 'one', data: [] }],
      scales: {},
    };
    layerManager.selectedLayers$.next([layer]);
    const cardContent: MockCard = fixture.debugElement.query(By.directive(MockCard)).componentInstance;
    expect(cardContent.dataset).toBe(layer.datasets[0]);
  });

  it('should set visibleData input based on timelineRange$', () => {
    cards.push(MockCard);
    const layer = {
      id: '1',
      name: 'Layer',
      datasets: [
        {
          label: 'one',
          data: [
            { x: 0, y: 0 },
            { x: 2, y: 2 },
            { x: 5, y: 5 },
          ],
        },
      ],
      scales: {},
    };
    layerManager.selectedLayers$.next([layer]);
    layerManager.timelineRange$.next({ min: 1, max: 3 });
    const cardContent: MockCard = fixture.debugElement.query(By.directive(MockCard)).componentInstance;
    expect(cardContent.visibleData).toEqual([{ x: 2, y: 2 }]);
  });

  it('should set dateRange input based on timelineRange$', () => {
    cards.push(MockCard);
    const layer = {
      id: '1',
      name: 'Layer',
      datasets: [{ label: 'one', data: [] }],
      scales: {},
    };
    layerManager.selectedLayers$.next([layer]);
    const min = new Date().getTime() - 5 * MILLISECONDS_PER_DAY;
    const max = new Date().getTime();
    layerManager.timelineRange$.next({ min, max });
    const cardContent: MockCard = fixture.debugElement.query(By.directive(MockCard)).componentInstance;
    expect(cardContent.dateRange).toEqual({
      min: new Date(min),
      max: new Date(max),
      days: 5,
    });
  });
});
