import {
  BloodPressureMapper,
  ComponentObservationMapper,
  DataLayer,
  DurationMedicationMapper,
  EncounterMapper,
  EncounterSummaryService,
  ManagedDataLayer,
  MedicationSummaryService,
  ScatterDataPointSummaryService,
  SimpleMedicationMapper,
  SimpleObservationMapper,
  provideChartsOnFhir,
  withChartLayer,
  withColors,
  withDataLayerServices,
  withMappers,
  withSummaryServices,
} from '@elimuinformatics/ngx-charts-on-fhir';
import { EncounterLayerService } from './datasets/encounters.service';
import { ObservationLayerService } from './datasets/observations.service';
import { MedicationLayerService } from './datasets/medications.service';

const defaultChartLayers = [
  {
    enabled: true,
    selected: true,
    datasets: [
      {
        label: 'Systolic Blood Pressure (Home)',
        yAxisID: 'Blood Pressure',
        data: [],
        chartsOnFhir: {
          group: 'Systolic Blood Pressure',
          colorPalette: 'light',
          tags: ['Home'],
          referenceRangeAnnotation: 'Systolic Blood Pressure Reference Range',
        },
      },
    ],
    name: 'Blood Pressure',
    scale: {
      display: 'auto',
      position: 'left',
      type: 'linear',
      stack: 'all',
      title: {
        display: true,
        text: ['Blood Pressure', 'mm[Hg]'],
      },
      id: 'Blood Pressure',
      stackWeight: 2,
      weight: 2,
      min: 56,
      max: 144,
    },
  },
  {
    enabled: true,
    selected: true,
    datasets: [
      {
        type: 'bar',
        label: 'lisinopril 40 MG Oral Tablet (Est. Duration)',
        yAxisID: 'medications',
        indexAxis: 'y',
        pointRadius: 10,
        pointHoverRadius: 10,
        pointBorderWidth: 1,
        data: [],
        chartsOnFhir: {
          backgroundStyle: 'transparent',
          group: 'lisinopril 40 MG Oral Tablet',
        },
        borderWidth: 1,
        borderSkipped: false,
        barPercentage: 1,
        grouped: false,
      },
    ],
    scale: {
      display: 'auto',
      position: 'left',
      type: 'category',
      offset: true,
      stack: 'all',
      stackWeight: 0.7,
      title: {
        display: true,
        text: ['Prescribed', 'Medications'],
      },
      ticks: {
        display: false,
      },
      id: 'medications',
    },
  },
] as any;

export default () =>
  provideChartsOnFhir(
    withChartLayer(defaultChartLayers),
    withColors('#e36667', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#c36d3c', '#f781bf', '#c46358', '#5a84a1', '#ba803f', '#90b354', '#ab7490'),
    withMappers(EncounterMapper, BloodPressureMapper, ComponentObservationMapper, SimpleObservationMapper, DurationMedicationMapper, SimpleMedicationMapper),
    withDataLayerServices(EncounterLayerService, ObservationLayerService, MedicationLayerService),
    withSummaryServices(EncounterSummaryService, MedicationSummaryService, ScatterDataPointSummaryService)
  );
