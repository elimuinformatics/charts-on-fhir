import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DataLayerManagerService,
  PatientBrowserModule,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { PatientBrowserDemoComponent } from './demo/patient-browser-demo.component';

@NgModule({
  declarations: [PatientBrowserDemoComponent],
  imports: [CommonModule, PatientBrowserModule],
  providers: [DataLayerManagerService],
})
export class PatientBrowserDemoModule {}
