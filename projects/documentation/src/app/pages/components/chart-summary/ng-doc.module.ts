import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartModule, FhirChartSummaryModule } from '@elimuinformatics/ngx-charts-on-fhir';
import { ChartSummaryDemoComponent } from './demo/chart-summary-demo.component';

@NgModule({
  declarations: [ChartSummaryDemoComponent],
  imports: [CommonModule, FhirChartModule, FhirChartSummaryModule],
})
export class ChartSummaryDemoModule {}
