import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ToolbarButtonName } from '../data-layer-toolbar/data-layer-toolbar/data-layer-toolbar.component';
import { FhirDataService } from '../fhir-data/fhir-data.service';

@Component({
  selector: 'fhir-chart-layout',
  templateUrl: './fhir-chart-layout.component.html',
  styleUrls: ['./fhir-chart-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartLayoutComponent {
  @Input() hideRemoveLayerButton: boolean = false;
  @Input() toolbar: ToolbarButtonName[] = ['loading', 'browser', 'options'];
  @Input() active: ToolbarButtonName | null = null;

  constructor(public fhir: FhirDataService) {}

  onToolbarChange(sidenav: MatSidenav, panel: ToolbarButtonName | null) {
    if (panel) {
      this.active = panel;
      sidenav.open();
    } else {
      sidenav.close();
    }
  }
}
