import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataLayerColorService } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';

const SVG_TRIANGLE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M2 20 12.05 4 22 20Z"/></svg>';

@Component({
  selector: 'fhir-chart-legend',
  templateUrl: './fhir-chart-legend.component.html',
  styleUrls: ['./fhir-chart-legend.component.css'],
})
export class FhirChartLegendComponent {
  constructor(
    public layerManager: DataLayerManagerService,
    public colorService: DataLayerColorService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIconLiteral('triangle', sanitizer.bypassSecurityTrustHtml(SVG_TRIANGLE));
  }
}
