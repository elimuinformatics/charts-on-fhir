import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartComponent,
  FhirChartSummaryComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-summary-demo',
  templateUrl: './chart-summary-demo.component.html',
  styleUrls: ['./chart-summary-demo.css'],
  imports: [CommonModule, FhirChartComponent, FhirChartSummaryComponent],
})
export class ChartSummaryDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
