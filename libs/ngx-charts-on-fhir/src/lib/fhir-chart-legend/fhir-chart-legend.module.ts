import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FhirChartLegendComponent } from './fhir-chart-legend.component';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { SortDatasets } from './sort-datasets.pipe';
import { FhirChartLegendItemComponent } from './fhir-chart-legend-item/fhir-chart-legend-item.component';
import { DatasetTagsLegendComponent } from './dataset-tags-legend/dataset-tags-legend.component';

@NgModule({
  declarations: [FhirChartLegendComponent, SortDatasets, FhirChartLegendItemComponent, DatasetTagsLegendComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, OverlayModule],
  exports: [FhirChartLegendComponent, DatasetTagsLegendComponent],
})
export class FhirChartLegendModule {}
