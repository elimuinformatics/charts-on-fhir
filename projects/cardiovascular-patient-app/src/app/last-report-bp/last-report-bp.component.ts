import { Component } from '@angular/core';
import { groupBy, mapValues } from 'lodash-es';
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
          const bloodPressureLayer = layers.find((layer) => layer.name === 'Blood Pressure')?.datasets;
          const groupedData = groupBy(bloodPressureLayer, (data) => data?.label?.startsWith('Systolic') ? 'systolic' : 'diastolic');
          const mostRecentData = mapValues(groupedData, (data) => data[data.length - 1].data.at(-1));
          return {
            systolic: { date: mostRecentData['systolic']?.x, value: mostRecentData['systolic']?.y },
            diastolic: { date: mostRecentData['diastolic']?.x, value: mostRecentData['diastolic']?.y },
          };
        })
      )
      .subscribe((layers: any) => {
        if (layers.diastolic.date !== undefined && layers.systolic.date !== undefined) {
          this.lastReportedBPdata = {
            systolic: { date: `${formatDate(layers.systolic.date)} at ${formatTime(layers.systolic.date)}`, value: layers.systolic.value },
            diastolic: { date: `${formatDate(layers.diastolic.date)} at ${formatTime(layers.diastolic.date)}`, value: layers.diastolic.value },
          }
        }
      });
  }
}
