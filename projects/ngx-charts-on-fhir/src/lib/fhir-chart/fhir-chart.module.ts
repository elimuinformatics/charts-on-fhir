import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FhirChartComponent } from './fhir-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FhirChartComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  exports: [FhirChartComponent],
})
export class FhirChartModule {}
