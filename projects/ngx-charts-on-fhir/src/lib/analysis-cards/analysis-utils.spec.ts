import { DeepPartial } from 'chart.js/types/utils';
import { AnnotationOptions } from 'chartjs-plugin-annotation';
import { DataLayer, Dataset } from '../data-layer/data-layer';
import { computeDaysOutOfRange, isReferenceRangeFor } from './analysis-utils';

fdescribe('Analysis Utils', () => {
  describe('isReferenceRangeFor', () => {
    it("should return true for dataset's reference range", () => {
      const dataset: Dataset = { label: 'Test', data: [] };
      const annotation: DeepPartial<AnnotationOptions> = {
        label: { content: 'Test Reference Range' },
        yMin: 0,
        yMax: 10,
        yScaleID: 'Scale',
      };
      expect(isReferenceRangeFor(dataset)(annotation)).toBeTrue();
    });
    it('should return false for other annotation', () => {
      const dataset: Dataset = { label: 'Test', data: [] };
      const annotation: DeepPartial<AnnotationOptions> = {
        label: { content: 'Nope' },
      };
      expect(isReferenceRangeFor(dataset)(annotation)).toBeFalse();
    });
  });

  describe('computeDaysOutOfRange', () => {
    it('should return the number of days outside of the reference range', () => {
      const layer: DataLayer = {
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
        scales: {},
        annotations: [
          {
            label: { content: 'Test Reference Range' },
            yMin: 2,
            yMax: 4,
            yScaleID: 'Scale',
          },
        ],
      };
      const days = computeDaysOutOfRange(layer, layer.datasets[0], layer.datasets[0].data);
      expect(days).toBe(2);
    });
  });
});
