import { Component } from '@angular/core';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';

@Component({
  selector: 'timeframe-selector',
  templateUrl: './timeframe-selector.component.html',
  styleUrls: ['./timeframe-selector.component.css'],
})
export class TimeFrameSelectorComponent {
  timeframeSelectorButtons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];

  constructor(public configService: FhirChartConfigurationService, public layerManager: DataLayerManagerService) {}
}
