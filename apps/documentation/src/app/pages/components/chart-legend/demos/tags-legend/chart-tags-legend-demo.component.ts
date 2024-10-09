import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartLegendComponent,
  FhirChartTagsLegendComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-tags-legend-demo',
  templateUrl: './chart-tags-legend-demo.component.html',
  standalone: true,
  imports: [CommonModule, FhirChartLegendComponent, FhirChartTagsLegendComponent],
})
export class ChartTagsLegendDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
