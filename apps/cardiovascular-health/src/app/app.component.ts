import { Component, OnInit } from '@angular/core';
import { DataLayer, DataLayerManagerService } from '@elimuinformatics/ngx-charts-on-fhir';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAddDataLayer: boolean = false;
  layers: any[] = [];
  isAllLayerSelected = true;
  preDisableLayer: string[] = ['Glucose'];
  constructor(readonly layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.autoSelect(() => true);
    this.layerManager.autoEnable((layer) => layer.name !== 'Glucose');
    this.layerManager.autoSort(this.sortCompareFn);
    this.layerManager.retrieveAll();
  }

  sortCompareFn = (a: DataLayer, b: DataLayer) => {
    const layerOrder: string[] = ['Heart rate', 'Blood Pressure', 'O2 Sat', 'Glucose', 'Step Count', 'Body Weight', 'Medications'];
    return layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name);
  };
}
