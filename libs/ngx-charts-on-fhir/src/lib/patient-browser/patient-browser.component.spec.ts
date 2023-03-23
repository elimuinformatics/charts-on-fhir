import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PatientBrowserComponent } from './patient-browser.component';
import { PatientBrowserModule } from './patient-browser.module';

describe('PatientBrowserComponent', () => {
  let component: PatientBrowserComponent;
  let fixture: ComponentFixture<PatientBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientBrowserModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
