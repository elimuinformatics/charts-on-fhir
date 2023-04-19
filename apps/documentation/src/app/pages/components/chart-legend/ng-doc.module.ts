import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartLegendDemoComponent } from './demos/legend/chart-legend-demo.component';
import { ChartTagsLegendDemoComponent } from './demos/tags-legend/chart-tags-legend-demo.component';
import { FhirChartLegendModule } from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  imports: [CommonModule, FhirChartLegendModule],
  // Declare you demo components here
  declarations: [ChartLegendDemoComponent, ChartTagsLegendDemoComponent],
})
export class ChartLegendDemoModule {}
