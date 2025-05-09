import { NgZone } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Chart, TooltipItem } from 'chart.js';
import { hot, getTestScheduler } from 'jasmine-marbles';
import { EMPTY, of } from 'rxjs';
import { Dataset, ManagedDataLayer, TimelineChartType } from '../data-layer/data-layer';
import { ChartAnnotation, ChartAnnotations } from '../utils';
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
      animation: jasmine.anything(),
      plugins: jasmine.objectContaining({
        annotation: { annotations: jasmine.arrayContaining([jasmine.objectContaining({ scaleID: 'x' })]) },
      }),
    },
  } as const;

  let ngZone: jasmine.SpyObj<NgZone>;

  const timeframeAnnotationOptions: ChartAnnotation = { scaleID: 'x' };

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
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
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
        }),
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
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              scales: jasmine.objectContaining({
                one: jasmine.objectContaining({ id: 'one', title: { text: 'one' } }),
              }),
            },
          },
          z: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              scales: jasmine.objectContaining({
                one: jasmine.objectContaining({ id: 'one', title: { text: 'one' } }),
                two: jasmine.objectContaining({ id: 'two', title: { text: 'two' } }),
              }),
            },
          },
        }),
      );
    });

    it('should set min/max for scales', () => {
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [
            {
              label: 'one',
              data: [
                { x: 1, y: 1 },
                { x: 2, y: 2 },
              ],
            },
          ],
          scale: { id: 'one', title: { text: 'one' } },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: {
            ...emptyConfig,
            data: jasmine.anything(),
            options: {
              ...emptyConfig.options,
              scales: jasmine.objectContaining({
                one: {
                  id: 'one',
                  title: { text: 'one' },
                  min: 0.95,
                  max: 2.05,
                },
              }),
            },
          },
        }),
      );
    });

    it('timeline scale bounds should support floating bar chart', () => {
      const a: ManagedDataLayer[] = [
        {
          name: 'a1',
          id: 'a1',
          enabled: true,
          datasets: [
            {
              label: 'one',
              data: [
                { x: [1, 2], y: 'med1' },
                { x: [3, 5], y: 'med2' },
              ],
            },
          ],
          scale: { id: 'one', title: { text: 'one' } },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: {
            ...emptyConfig,
            data: jasmine.anything(),
            options: {
              ...emptyConfig.options,
              scales: jasmine.objectContaining({
                x: jasmine.objectContaining({
                  min: 1,
                  max: 5,
                }),
              }),
            },
          },
        }),
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
          annotations: [{ id: 'one', label: { content: 'one' } }],
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
          annotations: [{ id: 'two', label: { content: 'two' } }],
        },
      ];
      const layerManager: any = { selectedLayers$: hot('eab', { e, a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xyz', {
          x: emptyConfig,
          y: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              plugins: jasmine.objectContaining({
                annotation: {
                  annotations: jasmine.arrayContaining([{ id: 'one', label: { content: 'one' } }, jasmine.objectContaining({ scaleID: 'x' })]),
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
                  annotations: jasmine.arrayContaining([
                    { id: 'one', label: { content: 'one' } },
                    { id: 'two', label: { content: 'two' } },
                    jasmine.objectContaining({ scaleID: 'x' }),
                  ]),
                },
              }),
            },
          },
        }),
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
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: emptyConfig,
        }),
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
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('x', {
          x: {
            ...emptyConfig,
            data: { datasets: [{ label: 'one', data: [] }] },
          },
        }),
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
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xy', {
          x: jasmine.anything(), // cannot test prior state because it has been mutated
          y: {
            ...emptyConfig,
            data: {
              datasets: [{ label: 'one', data: [], borderColor: '#ffffff' }],
            },
          },
        }),
      );
    });

    it('should update config when a data point is added', () => {
      const a: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [] }],
          scale: { id: '1' },
        },
      ];
      const b: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [{ x: 1, y: 1 }] }],
          scale: { id: '1' },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('ab', { a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xy', {
          x: jasmine.anything(), // cannot test prior state because it has been mutated
          y: {
            ...emptyConfig,
            data: {
              datasets: [{ label: 'one', data: [{ x: 1, y: 1 }] }],
            },
          },
        }),
      );
    });

    it('should update config when a data point is removed', () => {
      const a: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [{ x: 1, y: 1 }] }],
          scale: { id: '1' },
        },
      ];
      const b: ManagedDataLayer[] = [
        {
          name: '1',
          id: '1',
          enabled: true,
          datasets: [{ label: 'one', data: [] }],
          scale: { id: '1' },
        },
      ];
      const layerManager: any = { selectedLayers$: hot('ab', { a, b }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      expect(configService.chartConfig$).toBeObservable(
        hot('xy', {
          x: jasmine.anything(), // cannot test prior state because it has been mutated
          y: {
            ...emptyConfig,
            data: {
              datasets: [{ label: 'one', data: [] }],
            },
          },
        }),
      );
    });
  });

  describe('timelineRange$', () => {
    it('should emit when timeline scale limits change', waitForAsync(() => {
      const a: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      let config = {} as TimelineConfiguration;
      configService.chartConfig$?.subscribe((c) => (config = c));
      getTestScheduler().schedule(() => (config.options?.scales?.['x'] as any).afterDataLimits({ min: 2, max: 3 }), 20);
      expect(configService.timelineRange$).toBeObservable(
        hot('--x', {
          x: { min: 2, max: 3 },
        }),
      );
    }));

    it('should run afterDataLimits callback within NgZone', waitForAsync(() => {
      const a: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      let config = {} as TimelineConfiguration;
      configService.chartConfig$?.subscribe((c) => (config = c));
      getTestScheduler().schedule(() => (config.options?.scales?.['x'] as any).afterDataLimits({ min: 2, max: 3 }), 20);
      getTestScheduler().flush();
      expect(ngZone.run).toHaveBeenCalledTimes(1);
    }));
  });

  describe('setSummaryRange', () => {
    it('should emit summaryRange$ with the given timeframe', () => {
      jasmine.clock().mockDate(new Date('2023-01-31T00:00'));
      const a: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      getTestScheduler().schedule(() => configService.setSummaryRange(3), 20);
      expect(configService.summaryRange$).toBeObservable(
        hot('--x', {
          x: { months: 3, min: new Date('2022-10-31T00:00').getTime(), max: new Date('2023-01-31T00:00').getTime() },
        }),
      );
    });

    it('should emit chartConfig$ with timeframe annotations', () => {
      jasmine.clock().mockDate(new Date('2023-01-31T00:00'));
      const a: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: hot('a', { a }) };
      const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      getTestScheduler().schedule(() => configService.setSummaryRange(3), 20);
      expect(configService.chartConfig$).toBeObservable(
        hot('x-y', {
          x: jasmine.anything(),
          y: {
            ...emptyConfig,
            options: {
              ...emptyConfig.options,
              plugins: jasmine.objectContaining({
                annotation: {
                  annotations: [
                    {
                      id: 'today',
                      scaleID: 'x',
                      label: { content: 'Today' },
                      value: new Date('2023-01-31T00:00').getTime(),
                    },
                    {
                      id: 'current',
                      scaleID: 'x',
                      label: { content: '3 months ago' },
                      value: new Date('2022-10-31T00:00').getTime(),
                    },
                    {
                      id: 'previous',
                      scaleID: 'x',
                      label: { content: '6 months ago' },
                      value: new Date('2022-07-31T00:00').getTime(),
                    },
                  ],
                },
              }),
            },
          },
        }),
      );
    });
  });

  describe('zoom', () => {
    let configService: FhirChartConfigurationService;

    beforeEach(() => {
      const layers: ManagedDataLayer[] = [{ name: 'a', id: 'a', datasets: [], scale: { id: 'a' } }];
      const layerManager: any = { selectedLayers$: of(layers) };
      configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    });

    it('should autoZoom by default', () => {
      configService.chart = jasmine.createSpyObj<Chart>('Chart', ['zoomScale']);
      expect(configService.isAutoZoom).toBe(true);
    });

    it('should call chart.zoom', () => {
      configService.chart = jasmine.createSpyObj<Chart>('Chart', ['zoomScale']);
      configService.zoom({ min: 1, max: 2 });
      expect(configService.chart?.zoomScale).toHaveBeenCalledWith('x', { min: 1, max: 2 }, 'zoom');
    });

    it('should lock zoom range', () => {
      configService.chart = jasmine.createSpyObj<Chart>('Chart', ['zoomScale']);
      configService.zoom({ min: 1, max: 2 });
      expect(configService.isAutoZoom).toBe(false);
    });

    it('should set initial zoom if called before chart is initialized', waitForAsync(() => {
      configService.zoom({ min: 1, max: 2 });
      configService.chartConfig$?.subscribe((config) => {
        expect(configService.isAutoZoom).toBe(false);
        expect(config.options?.scales?.['x']?.min).toBe(1);
        expect(config.options?.scales?.['x']?.max).toBe(2);
      });
    }));

    it('should zoom in correctly', () => {
      const mockChart = jasmine.createSpyObj<Chart>('Chart', ['zoomScale'], {
        scales: {
          x: jasmine.createSpyObj('xScale', ['getUserBounds']),
        },
      });
      mockChart.scales['x'].getUserBounds = jasmine.createSpy().and.returnValue({ min: 1, max: 2, minDefined: true, maxDefined: true });
      configService.chart = mockChart;
      configService.zoomIn();
      expect(mockChart.zoomScale).toHaveBeenCalledWith('x', { min: 1.05, max: 1.95 }, 'zoom');
    });

    it('should zoom out correctly', () => {
      const mockChart = jasmine.createSpyObj<Chart>('Chart', ['zoomScale'], {
        scales: {
          x: jasmine.createSpyObj('xScale', ['getUserBounds']),
        },
      });
      mockChart.scales['x'].getUserBounds = jasmine.createSpy().and.returnValue({ min: 1, max: 2, minDefined: true, maxDefined: true });
      configService.chart = mockChart;
      configService.zoomOut();
      expect(mockChart.zoomScale).toHaveBeenCalledWith('x', { min: 0.95, max: 2.05 }, 'zoom');
    });
  });

  describe('resetZoom', () => {
    let configService: FhirChartConfigurationService;
    let layers: ManagedDataLayer[];

    beforeEach(() => {
      layers = [
        {
          name: 'a',
          id: 'a',
          enabled: true,
          datasets: [
            {
              data: [
                { x: 10, y: 100 },
                { x: 20, y: 200 },
              ],
            },
          ],
          scale: { id: 'a' },
        },
      ];
      const layerManager: any = { selectedLayers$: of(layers) };
      configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
      configService.chart = jasmine.createSpyObj<Chart>('Chart', ['zoomScale']);
    });

    it('should call chart.zoom with data bounds', waitForAsync(() => {
      configService.chartConfig$?.subscribe();
      configService.resetZoom();
      expect(configService.chart?.zoomScale).toHaveBeenCalledWith('x', { min: 10, max: 20 }, 'zoom');
    }));

    it('should unlock zoom range', () => {
      configService.chartConfig$?.subscribe();
      configService.zoom({ min: 1, max: 2 });
      configService.resetZoom();
      expect(configService.isAutoZoom).toBe(true);
    });

    it('should ignore NaN in data', waitForAsync(() => {
      layers[0].datasets[0].data.unshift({ x: NaN, y: 0 });
      layers[0].datasets[0].data.push({ x: NaN, y: 0 });
      configService.chartConfig$?.subscribe();
      configService.resetZoom();
      expect(configService.chart?.zoomScale).toHaveBeenCalledWith('x', { min: 10, max: 20 }, 'zoom');
    }));
  });

  it('should return the correct tooltip footer text when reference range is defined', () => {
    const dataset: Dataset = {
      label: 'Test',
      yAxisID: 'scale',
      data: [
        { x: 10, y: 100 },
        { x: 20, y: 200 },
      ],
      chartsOnFhir: {
        referenceRangeAnnotation: 'test-ref-range',
      },
    };
    const scale = { id: 'scale', type: 'linear' } as const;
    const annotations: ChartAnnotations = [
      {
        id: 'test-ref-range',
        label: { content: 'Test Reference Range' },
        yScaleID: 'scale',
        yMax: 20,
        yMin: 10,
      },
    ];
    const layerManager: any = { selectedLayers$: EMPTY };
    const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    const config = configService.buildConfiguration([dataset], { scale }, annotations);
    const tooltipItems = [{ dataset }] as TooltipItem<TimelineChartType>[];
    const beforeFooter = config.options!.plugins!.tooltip!.callbacks!.beforeFooter!.bind({} as any);
    const footerText = beforeFooter(tooltipItems);
    expect(footerText).toEqual('Reference Range 10 - 20');
  });

  it('should use tooltip property from data point as the tooltip label', () => {
    const dataset: Dataset = {
      label: 'Test',
      yAxisID: 'scale',
      data: [{ x: new Date('2023-01-01T00:00').getTime(), y: 1, tooltip: 'My Tooltip' }],
    };
    const scale = { id: 'scale', type: 'linear' } as const;
    const layerManager: any = { selectedLayers$: EMPTY };
    const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    const config = configService.buildConfiguration([dataset], { scale }, []);
    const tooltipItem = { raw: dataset.data[0] } as TooltipItem<TimelineChartType>;
    const callback = config.options!.plugins!.tooltip!.callbacks!.label!.bind({} as any);
    expect(callback(tooltipItem)).toEqual('My Tooltip');
  });

  it('should use default tooltip label if data point does not have a tooltip property', () => {
    const dataset: Dataset = {
      label: 'Test',
      yAxisID: 'scale',
      data: [{ x: new Date('2023-01-01T00:00').getTime(), y: 1 }],
    };
    const scale = { id: 'scale', type: 'linear' } as const;
    const layerManager: any = { selectedLayers$: EMPTY };
    const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    const config = configService.buildConfiguration([dataset], { scale }, []);
    const tooltipItem = { raw: dataset.data[0] } as TooltipItem<TimelineChartType>;
    spyOn(Chart.defaults.plugins.tooltip.callbacks, 'label').and.returnValue('Default Label');
    const callback = config.options!.plugins!.tooltip!.callbacks!.label!.bind({} as any);
    expect(callback(tooltipItem)).toEqual('Default Label');
  });

  it('should use y-value as tooltip title if y-value is a string', () => {
    const dataset: Dataset = {
      label: 'Test',
      yAxisID: 'scale',
      data: [{ x: new Date('2023-01-01T00:00').getTime(), y: 'Y Value' }],
    };
    const scale = { id: 'scale', type: 'category' } as const;
    const layerManager: any = { selectedLayers$: EMPTY };
    const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    const config = configService.buildConfiguration([dataset], { scale }, []);
    const tooltipItems = [{ raw: dataset.data[0] }] as TooltipItem<TimelineChartType>[];
    const callback = config.options!.plugins!.tooltip!.callbacks!.title!.bind({} as any);
    expect(callback(tooltipItems)).toEqual(['Y Value']);
  });

  it('should use date as tooltip title if y-value is not a string', () => {
    const dataset: Dataset = {
      label: 'Test',
      yAxisID: 'scale',
      data: [{ x: new Date('2023-01-01T00:00').getTime(), y: 1 }],
    };
    const scale = { id: 'scale', type: 'category' } as const;
    const layerManager: any = { selectedLayers$: EMPTY };
    const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    const config = configService.buildConfiguration([dataset], { scale }, []);
    const tooltipItems = [{ raw: dataset.data[0] }] as TooltipItem<TimelineChartType>[];
    const callback = config.options!.plugins!.tooltip!.callbacks!.title!.bind({} as any);
    expect(callback(tooltipItems)).toEqual(['1 Jan 2023 12:00 AM']);
  });

  it('should use tooltipTitle as tooltip title if tooltipTitle present', () => {
    const dataset: Dataset = {
      label: 'Test',
      yAxisID: 'scale',
      data: [{ x: new Date('2023-01-01T00:00').getTime(), y: 1, tooltipTitle: 'title' }],
    };
    const scale = { id: 'scale', type: 'category' } as const;
    const layerManager: any = { selectedLayers$: EMPTY };
    const configService = new FhirChartConfigurationService(layerManager, timeScaleOptions, timeframeAnnotationOptions, ngZone);
    const config = configService.buildConfiguration([dataset], { scale }, []);
    const tooltipItems = [{ raw: dataset.data[0] }] as TooltipItem<TimelineChartType>[];
    const callback = config.options!.plugins!.tooltip!.callbacks!.title!.bind({} as any);
    expect(callback(tooltipItems)).toEqual(['title']);
  });
});
