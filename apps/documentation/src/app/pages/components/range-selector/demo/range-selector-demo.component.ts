import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-range-selector-demo',
  templateUrl: './range-selector-demo.component.html',
})
export class RangeSelectorDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll(true);
  }
}