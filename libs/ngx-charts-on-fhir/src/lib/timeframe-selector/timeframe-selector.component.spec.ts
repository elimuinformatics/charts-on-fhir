import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeFrameSelectorComponent } from './timeframe-selector.component';

describe('TimeFrameSelectorComponent', () => {
  let component: TimeFrameSelectorComponent;
  let fixture: ComponentFixture<TimeFrameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeFrameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
