import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartSummaryComponent } from './fhir-chart-summary/fhir-chart-summary.component';
import { AnalysisModule } from '../analysis/analysis.module';
import { AnalysisCardsModule } from '../analysis-cards/analysis-cards.module';

@NgModule({
  declarations: [FhirChartSummaryComponent],
  imports: [CommonModule, AnalysisModule, AnalysisCardsModule],
  exports: [FhirChartSummaryComponent],
})
export class FhirChartSummaryModule {}
