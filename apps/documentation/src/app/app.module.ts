import {
  NG_DOC_DEFAULT_PAGE_PROCESSORS,
  NG_DOC_DEFAULT_PAGE_SKELETON,
  NgDocDefaultSearchEngine,
  NgDocNavbarComponent,
  NgDocRootComponent,
  NgDocSidebarComponent,
  provideNgDocApp,
  provideMainPageProcessor,
  providePageSkeleton,
  provideSearchEngine,
} from '@ng-doc/app';
import { NG_DOC_ROUTING, provideNgDocContext } from '@ng-doc/generated';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
  FhirChartLegendModule,
  PatientService,
  ScatterDataPointSummaryService,
  provideChartsOnFhir,
  withColors,
  withDataLayerServices,
  withSummaryServices,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { MockDataLayerService } from './mock/mock-data-layer.service';
import { MockPatientService } from './mock/mock-patient.service';
import { NgDocIconComponent, NgDocButtonIconComponent } from '@ng-doc/ui-kit';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocIconComponent,
    NgDocButtonIconComponent,
    FhirChartLegendModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        ...NG_DOC_ROUTING,
        {
          path: '**',
          redirectTo: 'introduction',
          pathMatch: 'full',
        },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 70],
      }
    ),
  ],
  providers: [
    provideNgDocContext(),
    provideNgDocApp(),
    provideSearchEngine(NgDocDefaultSearchEngine),
    providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
    provideMainPageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
    provideChartsOnFhir(
      withColors('#e36667', '#377eb8', '#4daf4a', '#984ea3'),
      withDataLayerServices(MockDataLayerService),
      withSummaryServices(ScatterDataPointSummaryService)
    ),
    { provide: PatientService, useClass: MockPatientService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
