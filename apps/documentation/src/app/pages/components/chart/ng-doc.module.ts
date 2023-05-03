import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDemoComponent } from './demos/chart/chart-demo.component';
import { FloatingContentDemoComponent } from './demos/floating-content/floating-content-demo.component';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartLegendModule,
  FhirChartModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@NgModule({
  declarations: [ChartDemoComponent, FloatingContentDemoComponent],
  imports: [CommonModule, FhirChartModule, FhirChartLegendModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class ChartDemoModule {}
