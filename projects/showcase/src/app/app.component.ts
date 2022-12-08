import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(readonly layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
  sidenavPanel: string | null = 'browser';
  onToolbarChange(sidenav: MatSidenav, panel: string | null) {
    if (panel) {
      this.sidenavPanel = panel;
      // close and then asynchronously re-open sidenav to trigger a resize
      sidenav.close();
      setTimeout(() => sidenav.open());
    } else {
      sidenav.close();
    }
  }
}
