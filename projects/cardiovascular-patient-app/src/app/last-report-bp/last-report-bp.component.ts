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
export class LastReportBPComponent {
  lastReportedBPdata?: LastReportedBPdata;

  constructor(private layerManager: DataLayerManagerService) { }

  ngOnInit(): void {
    this.layerManager.allLayers$
      .pipe(
        map((layers) => {
          const bloodPressureLayer = layers.find((layer) => layer.name === 'Blood Pressure');
          return bloodPressureLayer?.datasets.map((data) => data.data.slice(-1)[0]);
        }
        )
      )
      .subscribe((layers: any) => {
        if (layers?.length > 0) {
          this.lastReportedBPdata = {
            systolic: { date: `${formatDate(layers[1].x)} at ${formatTime(layers[1].x)}`, value: layers[1].y },
            diastolic: { date: `${formatDate(layers[0].x)} at ${formatTime(layers[0].x)}`, value: layers[0].y },
          };
        }
      });
  }
}
