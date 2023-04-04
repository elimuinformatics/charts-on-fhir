import { Component } from '@angular/core';
import { groupBy, mapValues, sortBy } from 'lodash-es';
import { DataLayerManagerService, formatDate, formatTime } from '@elimuinformatics/ngx-charts-on-fhir';
import { map } from 'rxjs';

export interface LastReportedBPdata {
  systolic: { date: number | string; value: number };
  diastolic: { date: number | string; value: number };
}

@Component({
  selector: 'last-report-bp',
  templateUrl: './last-report-bp.component.html',
  styleUrls: ['./last-report-bp.component.css'],
})
export class LastReportBPComponent {
  lastReportedBPdata?: LastReportedBPdata;
  constructor(public layerManager: DataLayerManagerService) {}

  ngOnInit(): void {
    this.layerManager.allLayers$
      .pipe(
        map((layers) => {
          const bloodPressureLayer = layers.find((layer) => layer.name === 'Blood Pressure')?.datasets;
          const groupedData = groupBy(bloodPressureLayer, (data) => (data?.label?.startsWith('Systolic') ? 'systolic' : 'diastolic'));
          const mostRecentData = mapValues(groupedData, (data) => {
            const sortedData = sortBy(data, (d: any) => new Date(d.data.at(-1).x));
            return sortedData[sortedData.length - 1].data.at(-1);
          });
          return {
            systolic: { date: mostRecentData['systolic']?.x, value: mostRecentData['systolic']?.y },
            diastolic: { date: mostRecentData['diastolic']?.x, value: mostRecentData['diastolic']?.y },
          };
        })
      )
      .subscribe((layers: any) => {
        if (layers.diastolic.date !== undefined && layers.systolic.date !== undefined) {
          this.lastReportedBPdata = {
            systolic: { date: layers.systolic.date, value: layers.systolic.value },
            diastolic: { date: layers.diastolic.date, value: layers.diastolic.value },
          };
        }
      });
  }

  formatDate(date: string | number | Date): string {
    return formatDate(date);
  }

  formatTime(date: string | number | Date): string {
    return formatTime(date);
  }
}
