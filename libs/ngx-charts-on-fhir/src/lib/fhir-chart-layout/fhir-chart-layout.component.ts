import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ToolbarButtonName } from '../data-layer-toolbar/data-layer-toolbar/data-layer-toolbar.component';
import { SharedDataLayerListService } from '../data-layer-list/shared-data-layer-list.service';
import { FhirDataService } from '../fhir-data/fhir-data.service';

/**
 * See `*ChartLayout` for example usage.
 */
@Component({
  selector: 'fhir-chart-layout',
  templateUrl: './fhir-chart-layout.component.html',
  styleUrls: ['./fhir-chart-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartLayoutComponent implements OnChanges {
  @Input() toolbar: ToolbarButtonName[] = ['loading', 'browser', 'options'];
  @Input() active: ToolbarButtonName | null = null;
  @Input() showAdvancedOptions: boolean = true;

  constructor(public fhir: FhirDataService, private sharedDataService: SharedDataLayerListService) {}

  ngOnChanges(): void {
    this.sharedDataService.showAdvancedOptions$.next(this.showAdvancedOptions);
  }

  onToolbarChange(sidenav: MatSidenav, panel: ToolbarButtonName | null) {
    if (panel) {
      this.active = panel;
      sidenav.open();
    } else {
      sidenav.close();
    }
  }
}
