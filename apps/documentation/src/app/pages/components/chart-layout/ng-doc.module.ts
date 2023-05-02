import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataLayerManagerService,
  FhirChartLayoutModule,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { ChartLayoutDemoComponent } from './demo/chart-layout-demo.component';
import { FullPageDemoComponent } from '../../../full-page-demo/full-page-demo.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ChartLayoutDemoComponent],
  imports: [
    CommonModule,
    FhirChartLayoutModule,
    FullPageDemoComponent,
    RouterModule.forChild([{ path: 'demo', component: ChartLayoutDemoComponent }]),
  ],
  providers: [DataLayerManagerService],
})
export class FhirChartLayoutDemoModule {}
