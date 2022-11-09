import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxChartsOnFhirComponent } from './ngx-charts-on-fhir.component';

describe('NgxChartsOnFhirComponent', () => {
  let component: NgxChartsOnFhirComponent;
  let fixture: ComponentFixture<NgxChartsOnFhirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxChartsOnFhirComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxChartsOnFhirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
