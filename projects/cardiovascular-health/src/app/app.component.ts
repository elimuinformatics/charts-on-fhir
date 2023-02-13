import { Component, OnInit } from '@angular/core';
import { DataLayer, DataLayerManagerService, TimelineChartType, TimelineDataPoint } from 'ngx-charts-on-fhir';
import { filter, switchMap, take } from 'rxjs';

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

    // temporary fix for color service not working correctly when layers are selected while data is loading
    this.layerManager.loading$
      .pipe(
        filter((loading) => !loading),
        switchMap(() => this.layerManager.availableLayers$),
        take(1)
      )
      .subscribe((layers) => {
        layers.forEach((layer) => {
          this.layerManager.select(layer.id);
        });
      });
  }
  sort = (things: DataLayer<TimelineChartType, TimelineDataPoint[]>[]) => {
    const layerOrder: string[] = ['Heart rate', 'Blood Pressure', 'O2 Sat', 'Glucose', 'Step Count', 'Body Weight', 'Medications']
    return things.sort((a: any, b: any) => layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name));
  }
}
