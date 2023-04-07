import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLayerListModule } from '@elimuinformatics/ngx-charts-on-fhir';
import { DataLayerListDemoComponent } from './demo/data-layer-list-demo.component';

@NgModule({
  declarations: [DataLayerListDemoComponent],
  imports: [CommonModule, DataLayerListModule],
})
export class DataLayerListDemoModule {}
