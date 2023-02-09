import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showAddDataLayer: boolean = false;
  layers: any[] = [];

  constructor(readonly layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.retrieveAll();

    // temporary fix for color service not working correctly when layers are selected while data is loading
    this.layerManager.loading$.pipe(switchMap((loading) => (loading ? EMPTY : this.layerManager.availableLayers$))).subscribe((layers) => {
      layers.forEach((layer) => this.layerManager.select(layer.id));
    });
  }
}
