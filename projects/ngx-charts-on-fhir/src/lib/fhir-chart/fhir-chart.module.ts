import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FhirChartComponent } from './fhir-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { RangeSelectorModule } from './range-selector/range-selector.module';

@NgModule({
  declarations: [FhirChartComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule,RangeSelectorModule],
  exports: [FhirChartComponent],
})
export class FhirChartModule {}
