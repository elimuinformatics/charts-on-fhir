import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirChartSummaryComponent } from './fhir-chart-summary.component';

describe('FhirChartSummaryComponent', () => {
  let component: FhirChartSummaryComponent;
  let fixture: ComponentFixture<FhirChartSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhirChartSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FhirChartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
