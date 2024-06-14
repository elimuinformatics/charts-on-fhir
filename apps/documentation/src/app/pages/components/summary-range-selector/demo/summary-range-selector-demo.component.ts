import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  FhirChartSummaryModule,
  SummaryRangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-summary-range-selector-demo',
  templateUrl: './summary-range-selector-demo.component.html',
  standalone: true,
  styleUrls: ['./summary-range-selector-demo.css'],
  imports: [CommonModule, FhirChartModule, FhirChartSummaryModule, SummaryRangeSelectorModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class SummaryRangeSelectorDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
