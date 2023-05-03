import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  FhirChartSummaryModule,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { ChartSummaryDemoComponent } from './demo/chart-summary-demo.component';

@NgModule({
  declarations: [ChartSummaryDemoComponent],
  imports: [CommonModule, FhirChartModule, FhirChartSummaryModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class ChartSummaryDemoModule {}
