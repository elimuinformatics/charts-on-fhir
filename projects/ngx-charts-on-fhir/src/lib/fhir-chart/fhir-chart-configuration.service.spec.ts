import { hot } from 'jasmine-marbles';
import { ManagedDataLayer } from '../data-layer/data-layer';
import { FhirChartConfigurationService } from './fhir-chart-configuration.service';

describe('FhirChartConfigurationService', () => {
  const emptyConfig = {
    type: 'line',
    data: { datasets: [] },
    options: {
      scales: {},
      plugins: {
        annotation: { annotations: [] },
      },
    },
  } as const;

  describe('mergeLayers', () => {
    it('should add datasets when layers are selected', () => {
      const e: ManagedDataLayer[] = [];
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [{ label: 'one', data: [] }],
          scales: {},
        },
      ];
      const b: ManagedDataLayer[] = [
        ...a,
        {
          name: 'b1',
          id: 'b1',
          enabled: true,
          datasets: [{ label: 'two', data: [] }],
          scales: {},
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            type: 'line',
            data: { datasets: [{ label: 'one', data: [] }] },
            options: {
              scales: {},
              plugins: {
                annotation: { annotations: [] },
              },
            },
          },
          z: {
            type: 'line',
            data: {
              datasets: [
                { label: 'one', data: [] },
                { label: 'two', data: [] },
              ],
            },
            options: {
              scales: {},
              plugins: {
                annotation: { annotations: [] },
              },
            },
          },
        })
      );
    });

    it('should add scales when layers are selected', () => {
      const e: ManagedDataLayer[] = [];
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [],
          scales: {
            one: { title: { text: 'one' } },
          },
        },
      ];
      const b: ManagedDataLayer[] = [
        ...a,
        {
          name: 'b1',
          id: 'b1',
          enabled: true,
          datasets: [],
          scales: {
            two: { title: { text: 'two' } },
          },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            type: 'line',
            data: { datasets: [] },
            options: {
              scales: {
                one: { title: { text: 'one' } },
              },
              plugins: {
                annotation: { annotations: [] },
              },
            },
          },
          z: {
            type: 'line',
            data: {
              datasets: [],
            },
            options: {
              scales: {
                one: { title: { text: 'one' } },
                two: { title: { text: 'two' } },
              },
              plugins: {
                annotation: { annotations: [] },
              },
            },
          },
        })
      );
    });

    it('should add annotations when layers are selected', () => {
      const e: ManagedDataLayer[] = [];
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [],
          scales: {},
          annotations: [{ label: { content: 'one' } }],
        },
      ];
      const b: ManagedDataLayer[] = [
        ...a,
        {
          name: 'b1',
          id: 'b1',
          enabled: true,
          datasets: [],
          scales: {},
          annotations: [{ label: { content: 'two' } }],
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            type: 'line',
            data: { datasets: [] },
            options: {
              scales: {},
              plugins: {
                annotation: {
                  annotations: [{ label: { content: 'one' } }],
                },
              },
            },
          },
          z: {
            type: 'line',
            data: {
              datasets: [],
            },
            options: {
              scales: {},
              plugins: {
                annotation: {
                  annotations: [{ label: { content: 'one' } }, { label: { content: 'two' } }],
                },
              },
            },
          },
        })
      );
    });
  });

  describe('updateConfiguration', () => {
    // Note: we cannot use rxjs marble testing for checking prior values of a mutable object.
    // All notifications that we see in expectObservable will have the final values.

    it('should emit an empty config when no layers are selected', () => {
      const layerManager: any = {
        selectedLayers$: hot('a', {
          a: [],
        }),
      };
      const configService = new FhirChartConfigurationService(layerManager);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: emptyConfig,
        })
      );
    });

    it('should emit config when a layer is initially selected', () => {
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [{ label: 'one', data: [] }],
          scales: {},
        },
      ];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: {
            type: 'line',
            data: { datasets: [{ label: 'one', data: [] }] },
            options: {
              scales: {},
              plugins: {
                annotation: { annotations: [] },
              },
            },
          },
        })
      );
    });

    it('should update config when a dataset property changes', () => {
      const a: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [], borderColor: '#000000' }],
          scales: {},
        },
      ];
      const b: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [], borderColor: '#ffffff' }],
          scales: {},
        },
      ];
      const layerManager: any = { selectedLayers$: hot('ab', { a, b }) };
      const configService = new FhirChartConfigurationService(layerManager);
      expect(configService.chartConfig$).toBeObservable(
        hot('xy', {
          x: jasmine.anything(), // cannot test prior state because it has been mutated
          y: {
            type: 'line',
            data: {
              datasets: [{ label: 'one', data: [], borderColor: '#ffffff' }],
            },
            options: {
              scales: {},
              plugins: {
                annotation: { annotations: [] },
              },
            },
          },
        })
      );
    });
  });
});
