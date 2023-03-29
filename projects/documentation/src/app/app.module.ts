import { NgDocModule } from '@ng-doc/app';
import { NG_DOC_ROUTING, NgDocGeneratedModule } from '@ng-doc/generated';
import { RouterModule } from '@angular/router';
import { NgDocSidebarModule } from '@ng-doc/app/components/sidebar';
import { NgDocNavbarModule } from '@ng-doc/app/components/navbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { COLOR_PALETTE, DataLayerService, ScatterDataPointSummaryService, SummaryService } from '@elimuinformatics/ngx-charts-on-fhir';
import { MockDataLayerService } from './mock/mock-data-layer.service';
import { NgDocIconModule } from '@ng-doc/ui-kit';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgDocNavbarModule,
    NgDocSidebarModule,
    NgDocIconModule,
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
    NgDocModule.forRoot(),
    NgDocGeneratedModule.forRoot(),
  ],
  providers: [
    { provide: COLOR_PALETTE, useValue: ['#e36667', '#377eb8', '#4daf4a', '#984ea3'] },
    { provide: DataLayerService, useClass: MockDataLayerService, multi: true },
    { provide: SummaryService, useClass: ScatterDataPointSummaryService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
