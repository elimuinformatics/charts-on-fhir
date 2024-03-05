import { NgDocDefaultSearchEngine, NgDocModule, provideSearchEngine } from '@ng-doc/app';
import { NG_DOC_ROUTING, NgDocGeneratedModule } from '@ng-doc/generated';
import { RouterModule } from '@angular/router';
import { NgDocSidebarModule } from '@ng-doc/app/components/sidebar';
import { NgDocNavbarModule } from '@ng-doc/app/components/navbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgDocNavbarModule,
    NgDocSidebarModule,
    NgDocIconComponent,
    NgDocButtonIconComponent,
    RouterModule.forRoot(
      [
        ...NG_DOC_ROUTING,
        // this page has a custom child route for the full-screen demo
        {
          path: 'components/chart-layout',
          loadChildren: () => import('./pages/components/chart-layout/ng-doc.module').then((m) => m.FhirChartLayoutDemoModule),
        },
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
    NgDocModule.forRoot(),
    NgDocGeneratedModule.forRoot(),
  ],
  providers: [
    provideSearchEngine(NgDocDefaultSearchEngine),
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
