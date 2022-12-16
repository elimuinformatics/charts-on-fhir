import { Component } from '@angular/core';
import { VisibleDataService } from '../../data-layer/visible-data.service';

@Component({
  selector: 'fhir-chart-summary',
  templateUrl: './fhir-chart-summary.component.html',
  styleUrls: ['./fhir-chart-summary.component.css'],
})
export class FhirChartSummaryComponent {
  constructor(public visibleDataService: VisibleDataService) {}
}

