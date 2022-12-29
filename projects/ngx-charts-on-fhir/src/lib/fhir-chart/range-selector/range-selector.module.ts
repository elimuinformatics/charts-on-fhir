import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RangeSelectorComponent } from './range-selector.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [RangeSelectorComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonToggleModule],
  exports: [RangeSelectorComponent],

})
export class RangeSelectorModule { }
