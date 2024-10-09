import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PatientBrowserComponent } from './patient-browser.component';
import { EMPTY } from 'rxjs';
import { PatientService } from './patient.service';

const mockPatient = {
  patients$: EMPTY,
  selectedPatient$: EMPTY,
};

describe('PatientBrowserComponent', () => {
  let component: PatientBrowserComponent;
  let fixture: ComponentFixture<PatientBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientBrowserComponent, NoopAnimationsModule],
      providers: [{ provide: PatientService, useValue: mockPatient }],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
