import { Component } from '@angular/core';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';

/**
 * See `*SummaryRangeSelector` for example usage.
 */
@Component({
  selector: 'summary-range-selector',
  templateUrl: './summary-range-selector.component.html',
  styleUrls: ['./summary-range-selector.component.css'],
})
export class SummaryRangeSelectorComponent {
  buttons = [
    { month: 1, value: '1 mo' },
    { month: 3, value: '3 mo' },
    { month: 6, value: '6 mo' },
    { month: 12, value: '1 y' },
  ];

  constructor(public configService: FhirChartConfigurationService, public layerManager: DataLayerManagerService) {}
}
