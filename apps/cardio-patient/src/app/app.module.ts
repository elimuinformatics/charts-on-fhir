import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FhirChartComponent,
  DataLayerBrowserComponent,
  FhirChartSummaryComponent,
  FhirDataService,
  FhirChartLegendComponent,
  BloodPressureMapper,
  ScatterDataPointSummaryService,
  provideChartsOnFhir,
  withColors,
  withDataLayerServices,
  withMappers,
  withSummaryServices,
  FhirChartTagsLegendComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { ReportBPModule } from './report-bp/report-bp.module';
import { LastReportBPModule } from './last-report-bp/last-report-bp.module';
import { OptionsMenuModule } from './options-menu/options-menu.module';
import { ObservationLayerService } from './datasets/observations.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FhirChartComponent,
    FhirChartLegendComponent,
    FhirChartSummaryComponent,
    NgChartsModule,
    BrowserAnimationsModule,
    DataLayerBrowserComponent,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    ReportBPModule,
    LastReportBPModule,
    OptionsMenuModule,
    FhirChartTagsLegendComponent,
  ],
  providers: [
    provideAppInitializer(() => inject(FhirDataService).initialize()),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    provideChartsOnFhir(
      withColors('#e36667', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#c36d3c', '#f781bf', '#c46358', '#5a84a1', '#ba803f', '#90b354', '#ab7490'),
      withMappers(BloodPressureMapper),
      withDataLayerServices(ObservationLayerService),
      withSummaryServices(ScatterDataPointSummaryService),
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
