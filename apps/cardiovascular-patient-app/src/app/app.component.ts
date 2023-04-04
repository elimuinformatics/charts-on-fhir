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

  constructor(readonly layerManager: DataLayerManagerService, private configService: FhirChartConfigurationService) {}

  ngOnInit(): void {
    this.layerManager.retrieveAll();

    this.layerManager.availableLayers$.subscribe((layers) => {
      layers.forEach((layer) => this.layerManager.select(layer.id));
    });

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
