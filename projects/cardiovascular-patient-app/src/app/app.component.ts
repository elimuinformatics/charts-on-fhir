import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAddDataLayer: boolean = false;
  showTitle: boolean = false;
  layers: any[] = [];
  appTitle: string = 'CDSIC Blood pressure App';

  constructor(readonly layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.retrieveAll();

    this.layerManager.availableLayers$.subscribe((layers) => {
      layers.forEach((layer) => this.layerManager.select(layer.id));
    });
  }

  sidenavPanel: string | null = null;
  onToolbarChange(sidenav: MatSidenav, panel: string | null) {
    if (panel) {
      this.sidenavPanel = panel;
      sidenav.open();
    } else {
      sidenav.close();
    }
  }
}
