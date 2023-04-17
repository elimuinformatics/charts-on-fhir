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
      data: [xy(10, 65), xy(5, 60), xy(0, 68)],
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
      label: 'Systolic Blood Pressure',
      data: [xy(10, 105), xy(5, 125), xy(0, 119)],
      fill: '+1',
      chartsOnFhir: {
        tags: ['Clinic'],
      },
    },
    {
      yAxisID: 'Blood Pressure',
      label: 'Diastolic Blood Pressure',
      data: [xy(10, 66), xy(5, 69), xy(0, 60)],
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
