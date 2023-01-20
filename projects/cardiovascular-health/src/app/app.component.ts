import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DataLayer, DataLayerManagerService } from 'ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAddDataLayer: boolean = false;
  layers: any[] = [];


  constructor(readonly layerManager: DataLayerManagerService) { }

  ngOnInit(): void {
    this.layerManager.retrieveAll();
    
    this.layerManager.availableLayers$.subscribe((layers) => {
      layers.map(layer => this.layerManager.select(layer.id))
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
