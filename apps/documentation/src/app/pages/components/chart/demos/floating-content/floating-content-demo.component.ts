import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartLegendComponent,
  FhirChartComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-floating-content-demo',
  templateUrl: './floating-content-demo.component.html',
  imports: [FhirChartComponent, FhirChartLegendComponent],
})
export class FloatingContentDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
