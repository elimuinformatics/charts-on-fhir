import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerBrowserModule,
  DataLayerManagerService,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-data-layer-browser-demo',
  templateUrl: './data-layer-browser-demo.component.html',
  standalone: true,
  imports: [CommonModule, DataLayerBrowserModule],
  providers: [DataLayerManagerService],
})
export class DataLayerBrowserDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
