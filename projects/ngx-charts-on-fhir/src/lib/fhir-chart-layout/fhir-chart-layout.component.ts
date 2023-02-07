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
  @Input() toolbar?: ToolbarButtonName[];
  @Input() sidebarOpened: boolean = true;
  sidenavPanel: ToolbarButtonName | null = 'browser';

  constructor(fhir: FhirDataService) {
    if (!fhir.isSmartLaunch && !fhir.client?.getPatientId()) {
      this.sidenavPanel = 'patients';
    }
  }

  onToolbarChange(sidenav: MatSidenav, panel: ToolbarButtonName | null) {
    if (panel) {
      this.sidenavPanel = panel;
      sidenav.open();
    } else {
      sidenav.close();
    }
  }
}
