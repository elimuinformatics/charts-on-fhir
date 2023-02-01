import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportBPComponent } from './report-BP.component';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ReportBPComponent],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, BrowserModule],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  exports: [ReportBPComponent],
})
export class ReportBPModule {}
