import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSelectorDemoComponent } from './demo/range-selector-demo.component';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  FhirChartSummaryModule,
  RangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  declarations: [RangeSelectorDemoComponent],
  imports: [CommonModule, FhirChartModule, RangeSelectorModule, FhirChartSummaryModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class RangeSelectorDemoModule {}
