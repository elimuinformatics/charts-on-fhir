import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { DataLayerColorService, COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { FhirChartComponent } from './fhir-chart.component';
import { FhirChartModule } from './fhir-chart.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
};

describe('FhirChartComponent', () => {
  let component: FhirChartComponent;
  let fixture: ComponentFixture<FhirChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FhirChartModule, NoopAnimationsModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
