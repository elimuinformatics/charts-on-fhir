import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  FhirChartSummaryModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-summary-demo',
  templateUrl: './chart-summary-demo.component.html',
  styleUrls: ['./chart-summary-demo.css'],
  standalone: true,
  imports: [CommonModule, FhirChartModule, FhirChartSummaryModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class ChartSummaryDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
