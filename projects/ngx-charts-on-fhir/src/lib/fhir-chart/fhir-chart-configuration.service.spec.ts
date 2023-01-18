import { NgZone } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { hot, getTestScheduler } from 'jasmine-marbles';
import { ManagedDataLayer } from '../data-layer/data-layer';
import { FhirChartConfigurationService, TimelineConfiguration } from './fhir-chart-configuration.service';


describe('FhirChartConfigurationService', () => {
  const timeScaleOptions = {
    type: 'time',
  } as const;

  const emptyConfig = {
    type: 'line',
    data: { datasets: [] },
    options: {
      scales: jasmine.anything(),
      plugins: jasmine.objectContaining({
        annotation: { annotations: [] },
      }),
    },
  } as const;

  let ngZone: jasmine.SpyObj<NgZone>;

  beforeEach(() => {
    // fake zone.run() can just invoke its callback because we don't care about change detection here
    ngZone = jasmine.createSpyObj('NgZone', ['run']);
    ngZone.run.and.callFake((fn) => fn());
  });

  describe('mergeLayers', () => {
    it('should add datasets when layers are selected', () => {
      const e: ManagedDataLayer[] = [];
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [{ label: 'one', data: [] }],
          scale: { id: 'a1' },
        },
      ];
      const b: ManagedDataLayer[] = [
        ...a,
        {
          name: 'b1',
          id: 'b1',
          enabled: true,
          datasets: [{ label: 'two', data: [] }],
          scale: { id: 'b1' },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            ...emptyConfig,
            data: { datasets: [{ label: 'one', data: [] }] },
          },
          z: {
            ...emptyConfig,
            data: {
              datasets: [
                { label: 'one', data: [] },
                { label: 'two', data: [] },
              ],
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
          scale: { id: 'one', title: { text: 'one' } },
        },
      ];
      const b: ManagedDataLayer[] = [
        ...a,
        {
          name: 'b1',
          id: 'b1',
          enabled: true,
          datasets: [],
          scale: { id: 'two', title: { text: 'two' } },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              scales: jasmine.objectContaining({
                one: { id: 'one', title: { text: 'one' } },
              }),
            },
          },
          z: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              scales: jasmine.objectContaining({
                one: { id: 'one', title: { text: 'one' } },
                two: { id: 'two', title: { text: 'two' } },
              }),
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
          scale: { id: 'a1' },
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
          scale: { id: 'b1' },
          annotations: [{ label: { content: 'two' } }],
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              plugins: jasmine.objectContaining({
                annotation: {
                  annotations: [{ label: { content: 'one' } }],
                },
              }),
            },
          },
          z: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              plugins: jasmine.objectContaining({
                annotation: {
                  annotations: [{ label: { content: 'one' } }, { label: { content: 'two' } }],
                },
              }),
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
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
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
          scale: { id: '1' },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: {
            ...emptyConfig,
            data: { datasets: [{ label: 'one', data: [] }] },
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
          scale: { id: '1' },
        },
      ];
      const b: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [], borderColor: '#ffffff' }],
          scale: { id: '1' },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('ab', { a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xy', {
          x: jasmine.anything(), // cannot test prior state because it has been mutated
          y: {
            ...emptyConfig,
            data: {
              datasets: [{ label: 'one', data: [], borderColor: '#ffffff' }],
            },
          },
        })
      );
    });
  });

  describe('timelineRange$', () => {
    it('should emit when timeline scale limits change', waitForAsync(() => {
      const a: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      let config = {} as TimelineConfiguration;
      configService.chartConfig$.subscribe((c) => (config = c));
      getTestScheduler().schedule(() => (config.options?.scales?.['timeline'] as any).afterDataLimits({ min: 2, max: 3 }), 20);
      expect(configService.timelineRange$).toBeObservable(
        hot('--x', {
          x: { min: 2, max: 3 },
        })
      );
    }));

    it('should run afterDataLimits callback within NgZone', waitForAsync(() => {
      const a: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, ngZone);
      let config = {} as TimelineConfiguration;
      configService.chartConfig$.subscribe((c) => (config = c));
      getTestScheduler().schedule(() => (config.options?.scales?.['timeline'] as any).afterDataLimits({ min: 2, max: 3 }), 20);
      getTestScheduler().flush();
      expect(ngZone.run).toHaveBeenCalledTimes(1);
    }));
  });
});
