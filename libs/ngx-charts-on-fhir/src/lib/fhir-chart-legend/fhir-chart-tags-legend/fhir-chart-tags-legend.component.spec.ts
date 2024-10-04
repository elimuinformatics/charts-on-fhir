import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FhirChartTagsLegendComponent } from './fhir-chart-tags-legend.component';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { EMPTY } from 'rxjs';

const mockLayerManager = {
  enabledLayers$: EMPTY,
};

describe('FhirChartTagsLegendComponent', () => {
  let component: FhirChartTagsLegendComponent;
  let fixture: ComponentFixture<FhirChartTagsLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: DataLayerManagerService, useValue: mockLayerManager }],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartTagsLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
