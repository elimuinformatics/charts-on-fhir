import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineRangeSelectorComponent } from './timeline-range-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [TimelineRangeSelectorComponent],
  imports: [CommonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatButtonToggleModule, MatMenuModule],
  exports: [TimelineRangeSelectorComponent],
})
export class TimelineRangeSelectorModule {}
