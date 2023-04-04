import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSelectorComponent } from './range-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RangeSelectorComponent],
  imports: [CommonModule, MatDatepickerModule, MatInputModule, MatButtonToggleModule, MatNativeDateModule, FormsModule],
  exports: [RangeSelectorComponent],
})
export class RangeSelectorModule {}
