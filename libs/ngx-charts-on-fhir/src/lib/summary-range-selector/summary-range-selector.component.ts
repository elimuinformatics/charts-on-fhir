import { Component } from '@angular/core';
import { FhirChartConfigurationService } from '../fhir-chart/fhir-chart-configuration.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

/**
 * See `*SummaryRangeSelector` for example usage.
 */
@Component({
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatInputModule, MatButtonToggleModule, MatNativeDateModule, FormsModule],
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
