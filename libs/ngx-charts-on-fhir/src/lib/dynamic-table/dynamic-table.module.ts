import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';

@NgModule({
  declarations: [DynamicTableComponent],
  imports: [CommonModule],
  exports: [DynamicTableComponent],
})
export class DynamicTableModule {}
