import { Component, OnInit } from '@angular/core';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';

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

    this.layerManager.availableLayers$.subscribe((layers) => {
      layers.forEach((layer) => this.layerManager.select(layer.id))
    });
  }
}
