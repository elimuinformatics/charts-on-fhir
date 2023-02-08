import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientBrowserComponent } from './patient-browser.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [PatientBrowserComponent],
  imports: [CommonModule, MatIconModule, MatTableModule, MatSortModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  exports: [PatientBrowserComponent],
})
export class PatientBrowserModule {}
