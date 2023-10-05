import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService, FhirChartConfigurationService, MILLISECONDS_PER_DAY } from '@elimuinformatics/ngx-charts-on-fhir';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  appTitle: string = environment.env.appTitle;
  cdsicLogo = environment.env.cdsicLogo;
  selectedIndex?: number;
  showLegend = false;

  constructor(readonly layerManager: DataLayerManagerService, private configService: FhirChartConfigurationService) {}

  ngOnInit(): void {
    this.layerManager.autoSelect(true);
    this.layerManager.retrieveAll();

    const now = new Date().getTime();
    this.configService.zoom({
      min: now - 30 * MILLISECONDS_PER_DAY,
      max: now,
    });
  }

  getBpLayerdata() {
    this.layerManager.retrieveAll();
    this.selectedIndex = 1;
  }
}
