import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartLegendComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-legend-demo',
  templateUrl: './chart-legend-demo.component.html',
  standalone: true,
  imports: [CommonModule, FhirChartLegendComponent],
})
export class ChartLegendDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
