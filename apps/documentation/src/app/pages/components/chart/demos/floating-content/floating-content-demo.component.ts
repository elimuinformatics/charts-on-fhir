import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartLegendModule,
  FhirChartModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-floating-content-demo',
  templateUrl: './floating-content-demo.component.html',
  standalone: true,
  imports: [CommonModule, FhirChartModule, FhirChartLegendModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class FloatingContentDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
