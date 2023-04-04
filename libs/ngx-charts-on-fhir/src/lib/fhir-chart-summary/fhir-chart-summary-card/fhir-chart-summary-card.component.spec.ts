import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DataLayerColorService, COLOR_PALETTE } from '../../data-layer/data-layer-color.service';
import { FhirChartSummaryCardComponent } from './fhir-chart-summary-card.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

describe('FhirChartSummaryCardComponent', () => {
  let component: FhirChartSummaryCardComponent;
  let fixture: ComponentFixture<FhirChartSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FhirChartSummaryCardComponent],
      imports: [MatCardModule, MatIconModule],
      providers: [
        { provide: DataLayerColorService, useValue: mockColorService },
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
});
