import { Component, Input } from '@angular/core';
import { FhirChartComponent } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'options-menu',
  templateUrl: './options-menu.component.html',
})
export class OptionsMenuComponent {
  @Input() chart?: FhirChartComponent;
  toggleLegend(value: boolean) {
    if (this.chart) {
      this.chart.legendPosition = value ? 'float' : 'none';
    }
  }
}
