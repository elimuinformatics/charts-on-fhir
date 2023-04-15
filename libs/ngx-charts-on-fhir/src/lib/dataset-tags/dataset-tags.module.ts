import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatasetTagsLegendComponent } from './dataset-tags-legend/dataset-tags-legend.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DatasetTagsLegendComponent],
  imports: [CommonModule, MatIconModule],
  exports: [DatasetTagsLegendComponent],
})
export class DatasetTagsModule {}
