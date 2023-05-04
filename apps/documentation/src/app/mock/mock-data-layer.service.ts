import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { MILLISECONDS_PER_DAY, DataLayerService, DataLayer } from '@elimuinformatics/ngx-charts-on-fhir';

@Injectable()
export class MockDataLayerService implements DataLayerService {
  name = 'MockDataLayerService';
  layers: DataLayer[] = [heartRateLayer, bloodPressureLayer];
  retrieve = () => from(this.layers);
}

export function xy(daysAgo: number, value: number) {
  return {
    x: new Date().getTime() - daysAgo * MILLISECONDS_PER_DAY,
    y: value,
  };
}

const heartRateLayer: DataLayer = {
  name: 'Heart Rate',
  category: ['Observation'],
  datasets: [
    {
      yAxisID: 'Heart Rate',
      label: 'Heart Rate',
      data: [xy(160, 65), xy(120, 67), xy(95, 66), xy(60, 64), xy(33, 62), xy(0, 63)],
      pointStyle: 'rect',
      chartsOnFhir: {
        tags: ['Clinic'],
      },
    },
  ],
  scale: {
    id: 'Heart Rate',
    title: { text: 'Heart Rate', display: true },
    type: 'linear',
    position: 'left',
    stack: 'all',
  },
};

const bloodPressureLayer: DataLayer = {
  name: 'Blood Pressure',
  category: ['Observation'],
  datasets: [
    {
      yAxisID: 'Blood Pressure',
      label: 'Systolic',
      data: [xy(160, 105), xy(120, 126), xy(95, 116), xy(60, 129), xy(33, 123), xy(0, 110)],
      fill: '+1',
      chartsOnFhir: {
        tags: ['Clinic'],
      },
    },
    {
      yAxisID: 'Blood Pressure',
      label: 'Diastolic',
      data: [xy(160, 66), xy(120, 72), xy(95, 70), xy(60, 71), xy(33, 67), xy(0, 68)],
      chartsOnFhir: {
        tags: ['Clinic'],
      },
    },
  ],
  scale: {
    id: 'Blood Pressure',
    title: { text: 'Blood Pressure', display: true },
    type: 'linear',
    position: 'left',
    stack: 'all',
  },
};
