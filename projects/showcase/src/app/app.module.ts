import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { dataLayerProviders } from './providers/data-layer-providers';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { mapperProviders } from './providers/mapper-providers';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomCardExampleComponent } from './cards/custom-card-example/custom-card-example.component';
import { analysisCardProviders } from './providers/analysis-card-providers';
import paletteProvider from './providers/palette-provider';
import {
  FhirChartModule,
  FhirConverterModule,
  FhirMappersModule,
  COLOR_PALETTE,
  AnalysisModule,
  DataLayerModule,
  DataLayerBrowserModule,
  DataLayerListModule,
  DataLayerToolbarModule,
  FhirChartSummaryModule,
  FhirDataService,
} from 'ngx-charts-on-fhir';
import { environment } from '../environments/environment';

function initializeFhirClientFactory(service: FhirDataService): () => Promise<void> {
  return () => service.initialize(environment.clientState);
}

@NgModule({
  declarations: [AppComponent, CustomCardExampleComponent],
  imports: [
    BrowserModule,
    FhirChartModule,
    FhirChartSummaryModule,
    NgChartsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    DataLayerModule,
    DataLayerBrowserModule,
    DataLayerListModule,
    DataLayerToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    FhirConverterModule,
    FhirMappersModule,
    AnalysisModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeFhirClientFactory, deps: [FhirDataService], multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: COLOR_PALETTE, useValue: paletteProvider },
    mapperProviders,
    dataLayerProviders,
    analysisCardProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
