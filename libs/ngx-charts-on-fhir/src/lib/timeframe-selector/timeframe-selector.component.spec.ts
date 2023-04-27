import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { DataLayerService } from '../data-layer/data-layer-manager.service';
import { SummaryService } from '../fhir-chart-summary/summary.service';
import { RangeSelectorModule } from '../range-selector/range-selector.module';
import { TimeFrameSelectorComponent } from './timeframe-selector.component';

describe('TimeFrameSelectorComponent', () => {
  let component: TimeFrameSelectorComponent;
  let fixture: ComponentFixture<TimeFrameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSelectorModule],
      providers: [DataLayerService, SummaryService, { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] }],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeFrameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
