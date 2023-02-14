import { Component } from '@angular/core';
import { DataLayerManagerService, formatDate, formatTime } from 'ngx-charts-on-fhir';
import { map } from 'rxjs';

interface LastReportedBPdata {
  systolic: { date: string; value: number };
  diastolic: { date: string; value: number };
}

@Component({
  selector: 'last-report-bp',
  templateUrl: './last-report-bp.component.html',
  styleUrls: ['./last-report-bp.component.css'],
})
export class LastReportBPComponent{
  lastReportedBPdata?: LastReportedBPdata;
  isLastPriorBp: boolean = true;

  constructor( private layerManager: DataLayerManagerService) { }

  ngOnInit(): void {
    this.layerManager.allLayers$
      .pipe(
        map((layers) =>
          layers
            .filter((layer) => layer.name === 'Blood Pressure')
            .map((layer) => layer.datasets.map((data) => data.data))
            .map((layer) => layer.map((data) => data.slice(-1)))
        )
      )
      .subscribe((layers: any) => {
        if (layers.length > 0) {
          this.isLastPriorBp = true;
          this.lastReportedBPdata = {
            systolic: { date: `${formatDate(layers[0][1][0].x)} at ${formatTime(layers[0][1][0].x)}`, value: layers[0][1][0].y },
            diastolic: { date: `${formatDate(layers[0][0][0].x)} at ${formatTime(layers[0][0][0].x)}`, value: layers[0][0][0].y },
          };
        } else {
          this.isLastPriorBp = false;
        }
      });
  }
}
