import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartLayoutModule } from '@elimuinformatics/ngx-charts-on-fhir';
import { ChartLayoutDemoComponent } from './demo/chart-layout-demo.component';

@NgModule({
  declarations: [ChartLayoutDemoComponent],
  imports: [CommonModule, FhirChartLayoutModule],
})
export class FhirChartLayoutDemoModule {}
