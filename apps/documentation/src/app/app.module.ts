import {
  NG_DOC_DEFAULT_PAGE_PROCESSORS,
  NG_DOC_DEFAULT_PAGE_SKELETON,
  NgDocDefaultSearchEngine,
  providePageProcessor,
  NgDocRootComponent,
  provideNgDocApp,
  providePageSkeleton,
  provideSearchEngine,
} from '@ng-doc/app';
import { NG_DOC_ROUTING, provideNgDocContext } from '@ng-doc/generated';
import { RouterModule } from '@angular/router';
import { NgDocSidebarComponent } from '@ng-doc/app/components/sidebar';
import { NgDocNavbarComponent } from '@ng-doc/app/components/navbar';
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
    NgDocRootComponent,
    NgDocNavbarComponent,
    NgDocSidebarComponent,
    NgDocIconComponent,
    NgDocButtonIconComponent,
    RouterModule.forRoot(
      [
        ...NG_DOC_ROUTING,
        // this page has a custom child route for the full-screen demo
        {
          path: 'components/chart-layout',
          loadChildren: () => import('./pages/components/chart-layout/demo/chart-layout-demo.component').then((m) => m.ChartLayoutDemoComponent),
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
  ],
  providers: [
    provideNgDocContext(),
    provideNgDocApp(),
    provideSearchEngine(NgDocDefaultSearchEngine),
    providePageSkeleton(NG_DOC_DEFAULT_PAGE_SKELETON),
    providePageProcessor(NG_DOC_DEFAULT_PAGE_PROCESSORS),
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
