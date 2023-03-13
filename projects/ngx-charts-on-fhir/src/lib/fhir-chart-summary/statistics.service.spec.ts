import { ScatterDataPoint } from 'chart.js';
import { DeepPartial } from 'chart.js/types/utils';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { DataLayer, Dataset, TimelineChartType } from '../data-layer/data-layer';
import { StatisticsService } from './statistics.service';

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
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            label: { content: 'Test Reference Range' },
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
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            label: { content: 'Test Reference Range' },
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
          },
          {
            label: 'Two',
            data: [
              { x: new Date('2022-01-01').getTime(), y: 11 },
              { x: new Date('2022-01-02').getTime(), y: 13 },
              { x: new Date('2022-01-03').getTime(), y: 15 },
            ],
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            label: { content: 'One Reference Range' },
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
          {
            label: { content: 'Two Reference Range' },
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

  describe('isReferenceRangeFor', () => {
    it("should return true for dataset's reference range", () => {
      const dataset: Dataset = { label: 'Test', data: [] };
      const annotation: DeepPartial<AnnotationOptions> = {
        label: { content: 'Test Reference Range' },
        yMin: 0,
        yMax: 10,
        yScaleID: 'Scale',
      };
      expect(service.isReferenceRangeFor(dataset)(annotation)).toBeTrue();
    });
    it('should return false for other annotation', () => {
      const dataset: Dataset = { label: 'Test', data: [] };
      const annotation: DeepPartial<AnnotationOptions> = {
        label: { content: 'Nope' },
      };
      expect(service.isReferenceRangeFor(dataset)(annotation)).toBeFalse();
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
          },
        ],
        scale: { id: 'test' },
        annotations: [
          {
            label: { content: 'Test Reference Range' },
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
