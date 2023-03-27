import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartLegendComponent } from './fhir-chart-legend.component';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { SortDatasets } from './sort-by.pipe';

@NgModule({
  declarations: [FhirChartLegendComponent,SortDatasets],
  imports: [CommonModule, MatIconModule, MatButtonModule, OverlayModule],
  exports: [FhirChartLegendComponent],
})
export class FhirChartLegendModule {}
