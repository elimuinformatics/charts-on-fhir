import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FhirChartSummaryComponent } from './fhir-chart-summary/fhir-chart-summary.component';
import { DynamicTableModule } from '../dynamic-table/dynamic-table.module';
import { FhirChartSummaryCardComponent } from './fhir-chart-summary-card/fhir-chart-summary-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FhirChartSummaryComponent, FhirChartSummaryCardComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, MatTooltipModule, DynamicTableModule],
  exports: [FhirChartSummaryComponent],
})
export class FhirChartSummaryModule {}
