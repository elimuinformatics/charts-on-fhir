import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FhirChartComponent } from './fhir-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { RangeSelectorComponent } from './range-selector/range-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [FhirChartComponent, RangeSelectorComponent],
  imports: [CommonModule, HttpClientModule, NgChartsModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatButtonToggleModule],
  exports: [FhirChartComponent],
})
export class FhirChartModule {}
