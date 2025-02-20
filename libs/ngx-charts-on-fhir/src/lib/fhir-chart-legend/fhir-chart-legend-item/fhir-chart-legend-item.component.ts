import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Dataset } from '../../data-layer/data-layer';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';

const SVG_TRIANGLE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M2 20 12.05 4 22 20Z"/></svg>';

@Component({
  imports: [CommonModule, MatIconModule, MatButtonModule, OverlayModule],
  selector: 'fhir-chart-legend-item',
  templateUrl: './fhir-chart-legend-item.component.html',
  styleUrls: ['./fhir-chart-legend-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartLegendItemComponent {
  @Input() icon?: Dataset['pointStyle'] = 'rect';
  @Input() color?: string = 'black';
  @Input() label?: string = '';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('triangle', sanitizer.bypassSecurityTrustHtml(SVG_TRIANGLE));
  }
}
