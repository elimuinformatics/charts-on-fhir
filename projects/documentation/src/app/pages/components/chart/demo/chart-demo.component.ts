import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-demo',
  templateUrl: './chart-demo.component.html',
})
export class ChartDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll(true);
  }
}
