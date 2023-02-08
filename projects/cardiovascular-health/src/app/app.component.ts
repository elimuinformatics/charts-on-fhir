import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DataLayer, DataLayerManagerService, TimelineChartType, TimelineDataPoint } from 'ngx-charts-on-fhir';

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
    this.layerManager.retrieveAll(this.sort, this.isAllLayerSelected);
  }

  sort = (things: DataLayer<TimelineChartType, TimelineDataPoint[]>[]) => {
    const layerOrder: string[] = ['Heart rate', 'Blood Pressure', 'O2 Sat', 'Glucose', 'Step Count', 'Body Weight', 'Medications']
    return things.sort((a: any, b: any) => layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name))
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
