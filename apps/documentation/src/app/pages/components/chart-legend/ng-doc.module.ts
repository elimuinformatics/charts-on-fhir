import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartLegendDemoComponent } from './demos/legend/chart-legend-demo.component';
import { ChartTagsLegendDemoComponent } from './demos/tags-legend/chart-tags-legend-demo.component';
import {
  DataLayerManagerService,
  FhirChartLegendModule,
  FhirChartTagsService,
} from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  imports: [CommonModule, FhirChartLegendModule],
  declarations: [ChartLegendDemoComponent, ChartTagsLegendDemoComponent],
  providers: [DataLayerManagerService, FhirChartTagsService],
})
export class ChartLegendDemoModule {}
