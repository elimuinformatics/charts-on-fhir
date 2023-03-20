import { DataLayer } from '../data-layer/data-layer';
import { StatisticsService } from './statistics.service';
import { ScatterDataPointSummaryService } from './summary.service';

const mockLayer: DataLayer = {
  name: 'Blood pressure',
  category: ['Vital Signs'],
  scale: { id: 'Blood pressure (mmHg)' },
  datasets: [],
  annotations: [],
};

describe('ScatterDataPointSummaryService', () => {
  describe('canSummarize', () => {
    it('should return true for layer with linear scale', () => {
      const summaryService = new ScatterDataPointSummaryService({} as StatisticsService);
      const layer: any = {
        scale: {
          type: 'linear',
        },
      };
      expect(summaryService.canSummarize(layer)).toBe(true);
    });

    it('should return false for layer with medication scale', () => {
      const summaryService = new ScatterDataPointSummaryService({} as StatisticsService);
      const layer: any = {
        scale: {
          type: 'medication',
        },
      };
      expect(summaryService.canSummarize(layer)).toBe(false);
    });
  });

  describe('summarize', () => {
    it('should include statistics for current and previous timespan', () => {
      const statisticsService = jasmine.createSpyObj<StatisticsService>('StatisticsService', ['getFormattedStatistics']);
      const summaryService = new ScatterDataPointSummaryService(statisticsService);
      statisticsService.getFormattedStatistics.and.callFake((layer, { min, max }) => ({
        min: String(min),
        max: String(max),
      }));
      const summary = summaryService.summarize(mockLayer, { min: 10, max: 15 });
      expect(summary).toEqual([
        {
          [`${mockLayer.name}`]: 'min',
          [`current ${1} days`]: '10',
          [`previous ${1} days`]: '4',
        },
        {
          [`${mockLayer.name}`]: 'max',
          [`current ${1} days`]: '15',
          [`previous ${1} days`]: '9',
        },
      ]);
    });
  });
});
