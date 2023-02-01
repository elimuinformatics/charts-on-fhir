import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhirChartLayoutComponent } from './fhir-chart-layout.component';

describe('FhirChartLayoutComponent', () => {
  let component: FhirChartLayoutComponent;
  let fixture: ComponentFixture<FhirChartLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhirChartLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FhirChartLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
