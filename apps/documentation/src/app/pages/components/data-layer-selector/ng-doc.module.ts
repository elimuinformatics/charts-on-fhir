import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataLayerSelectorModule,
  DataLayerManagerService,
  FhirChartModule,
  FhirChartConfigurationService,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { DataLayerSelectorDemoComponent } from './demo/data-layer-selector-demo.component';

@NgModule({
  declarations: [DataLayerSelectorDemoComponent],
  imports: [CommonModule, DataLayerSelectorModule, FhirChartModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class DataLayerSelectorDemoModule {}
