import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSelectorDemoComponent } from './demo/range-selector-demo.component';
import {
  FhirChartModule,
  FhirChartSummaryModule,
  RangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  declarations: [RangeSelectorDemoComponent],
  imports: [CommonModule, FhirChartModule, RangeSelectorModule, FhirChartSummaryModule],
})
export class RangeSelectorDemoModule {}
