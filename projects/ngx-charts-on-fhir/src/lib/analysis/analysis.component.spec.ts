import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';

import { AnalysisComponent, ANALYSIS_CARDS } from './analysis.component';

const mockLayerManager = {
  selectedLayers$: EMPTY,
  timelineRange$: EMPTY,
};

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysisComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: ANALYSIS_CARDS, useValue: [] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
