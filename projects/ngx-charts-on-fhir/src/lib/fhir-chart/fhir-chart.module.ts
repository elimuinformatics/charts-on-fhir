import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FhirChartComponent } from './fhir-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { RangeSelectorComponent } from './range-selector/range-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FhirChartComponent, RangeSelectorComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule, MatDatepickerModule, MatInputModule, MatButtonToggleModule,MatNativeDateModule, FormsModule],
  exports: [FhirChartComponent],
})
export class FhirChartModule { }
