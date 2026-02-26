import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartComponent,
  TimelineRangeSelectorComponent,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-timeline-range-selector-demo',
  templateUrl: './timeline-range-selector-demo.component.html',
  imports: [FhirChartComponent, TimelineRangeSelectorComponent],
})
export class TimelineRangeSelectorDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}

  ngOnInit() {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
