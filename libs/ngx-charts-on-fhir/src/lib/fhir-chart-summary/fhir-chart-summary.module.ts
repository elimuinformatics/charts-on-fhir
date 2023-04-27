import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartSummaryComponent } from './fhir-chart-summary/fhir-chart-summary.component';
import { DynamicTableModule } from '../dynamic-table/dynamic-table.module';
import { FhirChartSummaryCardComponent } from './fhir-chart-summary-card/fhir-chart-summary-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [FhirChartSummaryComponent, FhirChartSummaryCardComponent],
  imports: [CommonModule, MatTooltipModule, DynamicTableModule, OverlayModule],
  exports: [FhirChartSummaryComponent],
})
export class FhirChartSummaryModule {}
