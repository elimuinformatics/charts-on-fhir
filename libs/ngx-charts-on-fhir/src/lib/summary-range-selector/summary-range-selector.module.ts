import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { SummaryRangeSelectorComponent } from '../summary-range-selector/summary-range-selector.component';

@NgModule({
  declarations: [SummaryRangeSelectorComponent],
  imports: [CommonModule, MatDatepickerModule, MatInputModule, MatButtonToggleModule, MatNativeDateModule, FormsModule],
  exports: [SummaryRangeSelectorComponent],
})
export class SummaryRangeSelectorModule {}
