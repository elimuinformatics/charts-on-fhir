import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientBrowserComponent } from './patient-browser.component';

describe('PatientBrowserComponent', () => {
  let component: PatientBrowserComponent;
  let fixture: ComponentFixture<PatientBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientBrowserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
