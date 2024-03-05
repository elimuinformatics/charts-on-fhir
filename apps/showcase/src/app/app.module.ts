import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AppComponent } from './app.component';
import {
  FhirChartModule,
  FhirChartSummaryModule,
  FhirDataService,
  FhirChartLayoutModule,
  TimelineRangeSelectorModule,
  SummaryRangeSelectorModule,
  FhirChartLegendModule,
  provideChartsOnFhir,
  withColors,
  withDataLayerServices,
  withMappers,
  SimpleMedicationMapper,
  BloodPressureMapper,
  ComponentObservationMapper,
  EncounterMapper,
  SimpleObservationMapper,
  DurationMedicationMapper,
  withSummaryServices,
  EncounterSummaryService,
  MedicationSummaryService,
  ScatterDataPointSummaryService,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { environment } from '../environments/environment';
import { EncounterLayerService } from './datasets/encounters.service';
import { MedicationLayerService } from './datasets/medications.service';
import { ObservationLayerService } from './datasets/observations.service';

function initializeFhirClientFactory(service: FhirDataService): () => Promise<void> {
  return () => service.initialize(environment.clientState);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FhirChartLayoutModule,
    FhirChartModule,
    FhirChartSummaryModule,
    FhirChartLegendModule,
    TimelineRangeSelectorModule,
    SummaryRangeSelectorModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeFhirClientFactory, deps: [FhirDataService], multi: true },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    provideChartsOnFhir(
      withColors('#e36667', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#c36d3c', '#f781bf', '#c46358', '#5a84a1', '#ba803f', '#90b354', '#ab7490'),
      withMappers(EncounterMapper, BloodPressureMapper, ComponentObservationMapper, SimpleObservationMapper, DurationMedicationMapper, SimpleMedicationMapper),
      withDataLayerServices(EncounterLayerService, ObservationLayerService, MedicationLayerService),
      withSummaryServices(EncounterSummaryService, MedicationSummaryService, ScatterDataPointSummaryService)
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
