import { NgModule } from '@angular/core';
import { LastReportBPComponent } from './last-report-bp.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [LastReportBPComponent],
  imports: [MatCardModule, CommonModule, MatProgressBarModule],
  exports: [LastReportBPComponent],
})
export class LastReportBPModule {}
