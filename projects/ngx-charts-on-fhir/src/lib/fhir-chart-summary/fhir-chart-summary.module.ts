import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartSummaryComponent } from './fhir-chart-summary/fhir-chart-summary.component';
import { AnalysisCardsModule } from '../analysis-cards/analysis-cards.module';

@NgModule({
  declarations: [FhirChartSummaryComponent],
  imports: [CommonModule, AnalysisCardsModule],
  exports: [FhirChartSummaryComponent],
})
export class FhirChartSummaryModule {}
