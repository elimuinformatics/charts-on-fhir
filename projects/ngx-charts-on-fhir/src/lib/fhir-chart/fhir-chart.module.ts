import { NgModule } from '@angular/core';
import { FhirChartComponent } from './fhir-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [FhirChartComponent],
  imports: [CommonModule, NgChartsModule, MatProgressBarModule],
  exports: [FhirChartComponent],
})
export class FhirChartModule {}
