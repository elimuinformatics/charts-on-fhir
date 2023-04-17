import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppComponent } from './app.component';
import { dataLayerProviders } from './providers/data-layer-providers';
import { mapperProviders } from './providers/mapper-providers';
import paletteProvider from './providers/palette-provider';
import {
  FhirChartModule,
  COLOR_PALETTE,
  FhirChartSummaryModule,
  FhirDataService,
  FhirChartLayoutModule,
  RangeSelectorModule,
  DatasetTagsModule,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { environment } from '../environments/environment';
import { summaryProviders } from './providers/summary-providers';

function initializeFhirClientFactory(service: FhirDataService): () => Promise<void> {
  return () => service.initialize(environment.clientState);
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, FhirChartLayoutModule, FhirChartModule, FhirChartSummaryModule, RangeSelectorModule, DatasetTagsModule],
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
