import { StatisticsService, findReferenceRangeForDataset } from './statistics.service';
import { ScatterDataPoint } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { DataLayer, Dataset, TimelineChartType } from '../data-layer/data-layer';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(() => {
    service = new StatisticsService();
  });

  describe('getFormattedStatistics', () => {
    it('should compute statistics for the dataset', async () => {
      const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
        name: 'Layer',
        datasets: [
          {
            label: 'Test',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
            chartsOnFhir: {
              referenceRangeAnnotation: 'test-ref-range',
            },
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            id: 'test-ref-range',
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
        ],
      };
      const range = {
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-01-05').getTime(),
      };
      const values = service.getFormattedStatistics(layer, range);
      expect(values).toEqual({
        'Days Reported': '75% (3/4 days)',
        'Outside Goal': '67% (2/3 days)',
        Average: '3',
        Median: '3',
      });
    });

    it('should return "N/A" when there are no points in range', async () => {
      const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
        name: 'Layer',
        datasets: [
          {
            label: 'Test',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
            chartsOnFhir: {
              referenceRangeAnnotation: 'test-ref-range',
            },
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            id: 'test-ref-range',
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
        ],
      };
      const range = {
        min: new Date('2022-01-05').getTime(),
        max: new Date('2022-01-09').getTime(),
      };
      const values = service.getFormattedStatistics(layer, range);
      expect(values).toEqual({
        'Days Reported': '0% (0/4 days)',
        'Outside Goal': 'N/A',
        Average: 'N/A',
        Median: 'N/A',
      });
    });

    it('should omit "Outside Goal" when there is no matching reference range', async () => {
      const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
        name: 'Layer',
        datasets: [
          {
            label: 'Test',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            label: { content: 'Different Reference Range' },
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
        ],
      };
      const range = {
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-01-05').getTime(),
      };
      const values = service.getFormattedStatistics(layer, range);
      expect(values['Outside Goal']).toBeUndefined();
    });

    it('should combine multiple datasets', async () => {
      const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
        name: 'Layer',
        datasets: [
          {
            label: 'One',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
            chartsOnFhir: {
              referenceRangeAnnotation: 'one-ref-range',
            },
          },
          {
            label: 'Two',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 11 },
              { x: new Date('2022-01-02').getTime(), y: 13 },
              { x: new Date('2022-01-03').getTime(), y: 15 },
            ],
            chartsOnFhir: {
              referenceRangeAnnotation: 'two-ref-range',
            },
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            id: 'one-ref-range',
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
          {
            id: 'two-ref-range',
            yMin: 12,
            yMax: 16,
            yScaleID: 'Scale',
          },
        ],
      };
      const range = {
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-01-05').getTime(),
      };
      const values = service.getFormattedStatistics(layer, range);
      expect(values).toEqual({
        'Days Reported': '75% (3/4 days)',
        'Outside Goal': '67% (2/3 days)',
        Average: '13 / 3',
        Median: '13 / 3',
      });
    });

    it('should omit hidden datasets', async () => {
      const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
        name: 'Layer',
        datasets: [
          {
            label: 'Test',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
          },
          {
            label: 'Hidden',
            hidden: true,
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
          },
        ],
        scale: { id: 'test' },
      };
      const range = {
        min: new Date('2022-01-01').getTime(),
        max: new Date('2022-01-05').getTime(),
      };
      const values = service.getFormattedStatistics(layer, range);
      expect(values).toEqual({
        'Days Reported': '75% (3/4 days)',
        Average: '3',
        Median: '3',
      });
    });
  });

  describe('findReferenceRangeForDataset', () => {
    it("should return true for dataset's reference range", () => {
      const dataset: Dataset = {
        label: 'Test Dataset',
        data: [],
        chartsOnFhir: {
          referenceRangeAnnotation: 'test-ref-range',
        },
      };
      const annotations: DeepPartial<AnnotationOptions>[] = [
        { id: 'wrong', label: { content: 'Wrong Reference Range' }, xScaleID: 'x-axis', yScaleID: 'y-axis', yMin: 20, yMax: 30 },
        { id: 'test-ref-range', label: { content: 'Test Dataset Reference Range' }, xScaleID: 'x-axis', yScaleID: 'y-axis', yMin: 40, yMax: 50 },
      ];
      const result: DeepPartial<AnnotationOptions> | undefined = findReferenceRangeForDataset(annotations, dataset);
      expect(result).toEqual(annotations[1]);
    });
    it('should return undefined for other annotation', () => {
      const dataset: Dataset = { label: 'Test', data: [] };
      const annotations: DeepPartial<AnnotationOptions>[] = [
        { label: { content: 'Reference Range' }, xScaleID: 'x-axis', yScaleID: 'y-axis', yMin: 20, yMax: 30 },
      ];
      const result: DeepPartial<AnnotationOptions> | undefined = findReferenceRangeForDataset(annotations, dataset);
      expect(result).toBeUndefined();
    });
  });

  describe('computeDaysOutOfRange', () => {
    it('should return the number of days outside of the reference range', () => {
      const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
        name: 'Layer',
        datasets: [
          {
            label: 'Test',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 1 },
              { x: new Date('2022-01-02').getTime(), y: 3 },
              { x: new Date('2022-01-03').getTime(), y: 5 },
            ],
            chartsOnFhir: {
              referenceRangeAnnotation: 'test-ref-range',
            },
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            id: 'test-ref-range',
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
        ],
      };
      const days = service.getDaysOutOfRange(layer, layer.datasets[0], layer.datasets[0].data);
      expect(days?.length).toBe(2);
    });
  });
});
