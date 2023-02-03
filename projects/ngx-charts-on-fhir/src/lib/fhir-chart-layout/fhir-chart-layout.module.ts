import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerToolbarModule } from '../data-layer-toolbar/data-layer-toolbar.module';
import { FhirChartLayoutComponent } from './fhir-chart-layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DataLayerBrowserModule } from '../data-layer-browser/data-layer-browser.module';
import { DataLayerListModule } from '../data-layer-list/data-layer-list.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FhirChartLayoutComponent],
  imports: [CommonModule, MatSidenavModule, MatIconModule, DataLayerToolbarModule, DataLayerBrowserModule, DataLayerListModule],
  exports: [FhirChartLayoutComponent],
})
export class FhirChartLayoutModule {}
