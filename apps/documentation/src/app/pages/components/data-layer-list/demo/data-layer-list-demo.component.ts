import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataLayerListModule, DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-data-layer-list-demo',
  templateUrl: './data-layer-list-demo.component.html',
  standalone: true,
  imports: [CommonModule, DataLayerListModule],
})
export class DataLayerListDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
