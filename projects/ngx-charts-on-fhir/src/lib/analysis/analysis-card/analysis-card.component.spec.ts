import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataLayerColorService, COLOR_PALETTE } from '../../data-layer/data-layer-color.service';
import { AnalysisCardComponent } from './analysis-card.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

describe('AnalysisCardComponent', () => {
  let component: AnalysisCardComponent;
  let fixture: ComponentFixture<AnalysisCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalysisCardComponent],
      providers: [
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
