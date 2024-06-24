import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartModule,
  TimelineRangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'example-timeline-range-selector-demo',
  templateUrl: './timeline-range-selector-demo.component.html',
  standalone: true,
  imports: [CommonModule, FhirChartModule, TimelineRangeSelectorModule],
})
export class TimelineRangeSelectorDemoComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}

  ngOnInit() {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
