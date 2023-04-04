import { NgModule } from '@angular/core';
import { FhirChartComponent } from './fhir-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FhirChartLegendModule } from '../fhir-chart-legend/fhir-chart-legend.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [FhirChartComponent],
  imports: [CommonModule, NgChartsModule, MatProgressBarModule, FhirChartLegendModule, DragDropModule],
  exports: [FhirChartComponent],
})
export class FhirChartModule {}
