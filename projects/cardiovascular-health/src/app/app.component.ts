import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';
import { map, mergeAll, toArray } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAddDataLayer: boolean = false;
  layers: any[] = [];
  isAllLayerSelected = true;

  constructor(readonly layerManager: DataLayerManagerService) { }

  ngOnInit(): void {
    this.layerManager.retrieveAll(this.orderLayers, this.isAllLayerSelected);
  }

  orderLayers(layer: any) {
    const layerOrder: string[] = ['Heart rate', 'Blood Pressure', 'O2 Sat', 'Glucose', 'Step Count', 'Body Weight', 'Medications']
    return layer.pipe(
      toArray(),
      map((things: any) => things.sort((a: any, b: any) => layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name))),
      mergeAll()
    )
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
