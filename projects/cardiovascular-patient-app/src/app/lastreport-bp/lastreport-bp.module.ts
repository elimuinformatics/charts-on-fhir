import { NgModule } from '@angular/core';
import { LastReportBPComponent } from './lastreport-bp.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LastReportBPComponent],
  imports: [MatCardModule,CommonModule],
  exports: [LastReportBPComponent],
})
export class LastReportBPModule { }
