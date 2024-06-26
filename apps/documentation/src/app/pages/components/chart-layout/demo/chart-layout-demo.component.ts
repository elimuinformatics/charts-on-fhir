import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  DataLayerManagerService,
  FhirChartLayoutModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-layout-demo',
  templateUrl: './chart-layout-demo.component.html',
  styleUrls: ['./chart-layout-demo.component.css'],
  standalone: true,
  imports: [CommonModule, FhirChartLayoutModule, MatIconModule, MatButtonModule],
})
export class ChartLayoutDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
