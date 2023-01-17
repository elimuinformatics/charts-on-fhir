import { DataLayer } from '../data-layer/data-layer';
import { StatisticsService } from './statistics.service';
import { ScatterDataPointSummaryService } from './summary.service';

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
      const summary = summaryService.summarize({} as DataLayer, { min: 10, max: 15 });
      expect(summary).toEqual([
        {
          name: 'min',
          current: '10',
          previous: '4',
        },
        {
          name: 'max',
          current: '15',
          previous: '9',
        },
      ]);
    });
  });
});
