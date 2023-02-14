import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastReportBPComponent } from './lastreport-bp.component';
import { MatCardModule } from '@angular/material/card';

describe('LastReportBPComponent', () => {
  let component: LastReportBPComponent;
  let fixture: ComponentFixture<LastReportBPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [LastReportBPComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LastReportBPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
