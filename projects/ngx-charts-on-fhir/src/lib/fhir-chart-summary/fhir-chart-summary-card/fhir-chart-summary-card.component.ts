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

  getBackgroundStyle() {
    // Use multiple background layers to apply a gradient to the border while keeping the rest of the card white
    return `linear-gradient(white, white) padding-box, ${this.color} border-box`;
  }
}
