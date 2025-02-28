import { Component } from '@angular/core';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { CommonModule } from '@angular/common';
import { FhirChartLegendItemComponent } from '../fhir-chart-legend-item/fhir-chart-legend-item.component';
import { SortDatasets } from './sort-datasets.pipe';

@Component({
  imports: [CommonModule, FhirChartLegendItemComponent, SortDatasets],
  selector: 'fhir-chart-legend',
  templateUrl: './fhir-chart-legend.component.html',
  styleUrls: ['./fhir-chart-legend.component.css'],
})
export class FhirChartLegendComponent {
  constructor(
    public layerManager: DataLayerManagerService,
    public colorService: DataLayerColorService,
  ) {}
}
