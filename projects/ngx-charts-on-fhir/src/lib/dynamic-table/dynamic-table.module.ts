import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DynamicTableComponent } from './dynamic-table.component';

@NgModule({
  declarations: [DynamicTableComponent],
  imports: [CommonModule, MatTableModule],
  exports: [DynamicTableComponent],
})
export class DynamicTableModule {}
