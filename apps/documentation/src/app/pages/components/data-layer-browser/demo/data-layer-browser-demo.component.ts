import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerBrowserComponent,
  DataLayerManagerService,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-data-layer-browser-demo',
  templateUrl: './data-layer-browser-demo.component.html',
  imports: [CommonModule, DataLayerBrowserComponent],
})
export class DataLayerBrowserDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
