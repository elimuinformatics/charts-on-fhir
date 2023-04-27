import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService, DataLayerViews } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-data-layer-selector-demo',
  templateUrl: './data-layer-selector-demo.component.html',
})
export class DataLayerSelectorDemoComponent implements OnInit {
  views: DataLayerViews = {
    Combined: {
      selected: ['Heart Rate', 'Blood Pressure'],
      enabled: ['Heart Rate', 'Blood Pressure'],
    },
    'Only HR': {
      selected: ['Heart Rate', 'Blood Pressure'],
      enabled: ['Heart Rate'],
    },
    'Only BP': {
      selected: ['Heart Rate', 'Blood Pressure'],
      enabled: ['Blood Pressure'],
    },
  };

  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
