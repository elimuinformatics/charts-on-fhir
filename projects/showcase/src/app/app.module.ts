import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsOnFhirModule } from 'ngx-charts-on-fhir';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxChartsOnFhirModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
