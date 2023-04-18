import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { SortDatasets } from './fhir-chart-legend/sort-datasets.pipe';
import { FhirChartLegendComponent } from './fhir-chart-legend/fhir-chart-legend.component';
import { FhirChartLegendItemComponent } from './fhir-chart-legend-item/fhir-chart-legend-item.component';
import { FhirChartTagsLegendComponent } from './fhir-chart-tags-legend/fhir-chart-tags-legend.component';

@NgModule({
  declarations: [FhirChartLegendComponent, SortDatasets, FhirChartLegendItemComponent, FhirChartTagsLegendComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, OverlayModule],
  exports: [FhirChartLegendComponent, FhirChartTagsLegendComponent],
})
export class FhirChartLegendModule {}
