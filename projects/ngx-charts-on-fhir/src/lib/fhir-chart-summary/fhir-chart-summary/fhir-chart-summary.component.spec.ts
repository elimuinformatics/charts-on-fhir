import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ManagedDataLayer } from '../../data-layer/data-layer';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartSummaryComponent } from './fhir-chart-summary.component';

class MockLayerManager {
  selectedLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
  timelineRange$ = new ReplaySubject<{ min: number; max: number }>();
}

describe('FhirChartSummaryComponent', () => {
  let component: FhirChartSummaryComponent;
  let fixture: ComponentFixture<FhirChartSummaryComponent>;
  let layerManager: MockLayerManager;

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    await TestBed.configureTestingModule({
      declarations: [FhirChartSummaryComponent],
      providers: [{ provide: DataLayerManagerService, useValue: layerManager }],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
