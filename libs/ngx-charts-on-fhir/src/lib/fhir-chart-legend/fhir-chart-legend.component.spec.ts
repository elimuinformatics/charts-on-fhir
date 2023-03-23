import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { FhirChartLegendComponent } from './fhir-chart-legend.component';
import { FhirChartLegendModule } from './fhir-chart-legend.module';

const mockLayerManager = {};

describe('FhirChartLegendComponent', () => {
  let component: FhirChartLegendComponent;
  let fixture: ComponentFixture<FhirChartLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FhirChartLegendModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: COLOR_PALETTE, useValue: [] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
