import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { DataLayerToolbarComponent, ToolbarButtonName } from '../data-layer-toolbar/data-layer-toolbar/data-layer-toolbar.component';
import { SharedDataLayerListService } from '../data-layer-list/shared-data-layer-list.service';
import { FhirDataService } from '../fhir-data/fhir-data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PatientBrowserComponent } from '../patient-browser/patient-browser.component';
import { DataLayerListComponent } from '../data-layer-list/data-layer-list/data-layer-list.component';
import { DataLayerBrowserComponent } from '../data-layer-browser/data-layer-browser.component';

/**
 * See `*ChartLayout` for example usage.
 */
@Component({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    DataLayerToolbarComponent,
    PatientBrowserComponent,
    DataLayerListComponent,
    DataLayerBrowserComponent,
  ],
  selector: 'fhir-chart-layout',
  templateUrl: './fhir-chart-layout.component.html',
  styleUrls: ['./fhir-chart-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SharedDataLayerListService],
})
export class FhirChartLayoutComponent implements OnChanges {
  @Input() toolbar: ToolbarButtonName[] = ['loading', 'browser', 'options'];
  @Input() active: ToolbarButtonName | null = null;
  @Input() showAdvancedOptions: boolean = true;

  constructor(
    public fhir: FhirDataService,
    private readonly sharedDataService: SharedDataLayerListService,
  ) {}

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
