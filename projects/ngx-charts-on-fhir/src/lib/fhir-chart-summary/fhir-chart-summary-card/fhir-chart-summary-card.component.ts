import { Component, Input } from '@angular/core';

@Component({
  selector: 'fhir-chart-summary-card',
  templateUrl: './fhir-chart-summary-card.component.html',
  styleUrls: ['./fhir-chart-summary-card.component.css'],
})
export class FhirChartSummaryCardComponent {
  @Input() color?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
}
