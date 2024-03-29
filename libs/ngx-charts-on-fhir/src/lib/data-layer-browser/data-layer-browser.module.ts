import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerBrowserComponent } from './data-layer-browser.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [DataLayerBrowserComponent],
  imports: [CommonModule, MatIconModule, MatTableModule, MatSortModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  exports: [DataLayerBrowserComponent],
})
export class DataLayerBrowserModule {}
