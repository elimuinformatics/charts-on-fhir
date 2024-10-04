import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COLOR_PALETTE, DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { FhirChartLegendComponent } from './fhir-chart-legend.component';

const mockLayerManager = {};

describe('FhirChartLegendComponent', () => {
  let component: FhirChartLegendComponent;
  let fixture: ComponentFixture<FhirChartLegendComponent>;
  let colorService: DataLayerColorService;
  let palette: string[] = ['#FFFFFF', '#121212', '#000000'];

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      imports: [FhirChartLegendComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: COLOR_PALETTE, useValue: palette },
        { provide: DataLayerColorService, useValue: colorService },
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
