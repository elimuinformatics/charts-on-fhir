import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportBPComponent } from './report-bp.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ReportBPComponent],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, BrowserModule, MatCardModule],
  exports: [ReportBPComponent],
})
export class ReportBPModule {}