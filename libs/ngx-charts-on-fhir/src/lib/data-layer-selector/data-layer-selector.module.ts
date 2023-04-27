import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataLayerSelectorComponent } from './data-layer-selector.component';

@NgModule({
  declarations: [DataLayerSelectorComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  exports: [DataLayerSelectorComponent],
})
export class DataLayerSelectorModule {}
