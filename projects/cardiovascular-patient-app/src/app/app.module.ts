import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { dataLayerProviders } from './providers/data-layer-providers';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { mapperProviders } from './providers/mapper-providers';
import { MatButtonModule } from '@angular/material/button';
import paletteProvider from './providers/palette-provider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FhirChartModule,
  COLOR_PALETTE,
  DataLayerBrowserModule,
  FhirChartSummaryModule,
  FhirDataService,
} from 'ngx-charts-on-fhir';
import { environment } from '../environments/environment';
import { summaryProviders } from './providers/summary-providers';
import { ReportBPModule } from './report-bp/report-bp.module';

function initializeFhirClientFactory(service: FhirDataService): () => Promise<void> {
  return () => service.initialize(environment.clientState);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FhirChartModule,
    FhirChartSummaryModule,
    NgChartsModule,
    BrowserAnimationsModule,
    DataLayerBrowserModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    ReportBPModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeFhirClientFactory, deps: [FhirDataService], multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: COLOR_PALETTE, useValue: paletteProvider },
    mapperProviders,
    dataLayerProviders,
    summaryProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
