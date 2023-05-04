import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryRangeSelectorDemoComponent } from './demo/summary-range-selector-demo.component';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  FhirChartSummaryModule,
  SummaryRangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  declarations: [SummaryRangeSelectorDemoComponent],
  imports: [CommonModule, FhirChartModule, FhirChartSummaryModule, SummaryRangeSelectorModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class SummaryRangeSelectorDemoModule {}
