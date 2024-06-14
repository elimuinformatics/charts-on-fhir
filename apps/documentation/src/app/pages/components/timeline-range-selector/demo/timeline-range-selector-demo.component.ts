import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  DataLayerManagerService,
  FhirChartConfigurationService,
  FhirChartModule,
  TimelineRangeSelectorModule,
} from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'app-timeline-range-selector',
  templateUrl: './timeline-range-selector-demo.component.html',
  standalone: true,
  imports: [CommonModule, FhirChartModule, TimelineRangeSelectorModule],
  providers: [DataLayerManagerService, FhirChartConfigurationService],
})
export class TimelineRangeSelectorComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}

  ngOnInit() {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();
  }
}
