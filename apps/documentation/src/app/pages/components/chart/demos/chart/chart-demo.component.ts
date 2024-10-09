import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartLegendComponent,
  FhirChartComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-demo',
  templateUrl: './chart-demo.component.html',
  standalone: true,
  imports: [CommonModule, FhirChartComponent, FhirChartLegendComponent],
})
export class ChartDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
