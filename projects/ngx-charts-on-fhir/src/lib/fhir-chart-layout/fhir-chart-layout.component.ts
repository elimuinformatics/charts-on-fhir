import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ToolbarButtonName } from '../../public-api';

@Component({
  selector: 'fhir-chart-layout',
  templateUrl: './fhir-chart-layout.component.html',
  styleUrls: ['./fhir-chart-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartLayoutComponent {
  @Input() toolbar?: ToolbarButtonName[] = ['loading', 'browser', 'options'];
  @Input() sidebarOpened: boolean = true;
  sidenavPanel: ToolbarButtonName | null = 'browser';
  onToolbarChange(sidenav: MatSidenav, panel: ToolbarButtonName | null) {
    if (panel) {
      this.sidenavPanel = panel;
      sidenav.open();
    } else {
      sidenav.close();
    }
  }
}
