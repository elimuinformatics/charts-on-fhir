import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ROUTES, RouterModule } from '@angular/router';
import {
  DataLayerManagerService,
  FhirChartLayoutModule,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { AppRoutingModule } from 'apps/documentation/src/app/app-routing.module';
import { FullPageDemoComponent } from 'apps/documentation/src/app/full-page-demo/full-page-demo.component';

@Component({
  selector: 'example-chart-layout-demo',
  templateUrl: './chart-layout-demo.component.html',
  styleUrls: ['./chart-layout-demo.component.css'],
  standalone: true,
  imports: [CommonModule, FhirChartLayoutModule, FullPageDemoComponent, AppRoutingModule],
  providers: [DataLayerManagerService],
})
export class ChartLayoutDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
