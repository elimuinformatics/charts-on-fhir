import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-layout-demo',
  templateUrl: './chart-layout-demo.component.html',
  styleUrls: ['./chart-layout-demo.component.css'],
})
export class ChartLayoutDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
