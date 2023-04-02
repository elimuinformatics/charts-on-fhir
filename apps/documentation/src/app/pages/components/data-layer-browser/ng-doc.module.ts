import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerBrowserModule } from '@elimuinformatics/ngx-charts-on-fhir';
import { DataLayerBrowserDemoComponent } from './demo/data-layer-browser-demo.component';

@NgModule({
  declarations: [DataLayerBrowserDemoComponent],
  imports: [CommonModule, DataLayerBrowserModule],
})
export class DataLayerBrowserDemoModule {}
