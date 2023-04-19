import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-chart-tags-legend-demo',
  templateUrl: './chart-tags-legend-demo.component.html',
})
export class ChartTagsLegendDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll(true);
  }
}
