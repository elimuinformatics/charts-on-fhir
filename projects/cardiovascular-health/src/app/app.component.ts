import { Component, OnInit } from '@angular/core';
import { DataLayer, DataLayerManagerService } from 'ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAddDataLayer: boolean = false;
  layers: any[] = [];
  isAllLayerSelected = true;

  constructor(readonly layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.retrieveAll(this.sortCompareFn, this.isAllLayerSelected);
  }
  
  sortCompareFn = (a: DataLayer, b: DataLayer) => {
    const layerOrder: string[] = ['Heart rate', 'Blood Pressure', 'O2 Sat', 'Glucose', 'Step Count', 'Body Weight', 'Medications'];
    return layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name);
  };
}
