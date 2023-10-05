import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportBPComponent } from './report-bp.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { CustomErrorStateMatcher } from './custom-error-state-matcher';

@NgModule({
  declarations: [ReportBPComponent],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, BrowserModule, MatCardModule, MatSnackBarModule],
  exports: [ReportBPComponent],
  providers: [{ provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }],
})
export class ReportBPModule {}
