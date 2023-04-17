import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirChartLegendItemComponent } from './fhir-chart-legend-item.component';
import { MatIconModule } from '@angular/material/icon';

describe('FhirChartLegendItemComponent', () => {
  let component: FhirChartLegendItemComponent;
  let fixture: ComponentFixture<FhirChartLegendItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FhirChartLegendItemComponent],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartLegendItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
