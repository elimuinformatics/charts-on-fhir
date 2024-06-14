import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  DataLayerSelectorModule,
  DataLayerViews,
  FhirChartConfigurationService,
  FhirChartModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-data-layer-selector-demo',
  templateUrl: './data-layer-selector-demo.component.html',
  standalone: true,
  imports: [CommonModule, DataLayerSelectorModule, FhirChartModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class DataLayerSelectorDemoComponent implements OnInit {
  views: DataLayerViews = {
    Combined: {
      selected: ['Heart Rate', 'Blood Pressure'],
      enabled: ['Heart Rate', 'Blood Pressure'],
    },
    'Only HR': {
      selected: ['Heart Rate', 'Blood Pressure'],
      enabled: ['Heart Rate'],
    },
    'Only BP': {
      selected: ['Heart Rate', 'Blood Pressure'],
      enabled: ['Blood Pressure'],
    },
  };

  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
