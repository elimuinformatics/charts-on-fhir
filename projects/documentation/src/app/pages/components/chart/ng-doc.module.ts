import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDemoComponent } from './demo/chart-demo.component';
import { FhirChartModule } from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  declarations: [ChartDemoComponent],
  imports: [CommonModule, FhirChartModule],
})
export class ChartDemoModule {}
