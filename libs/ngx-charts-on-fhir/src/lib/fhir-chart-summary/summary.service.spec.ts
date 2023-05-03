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

    it('should return false for layer with category scale', () => {
      const summaryService = new ScatterDataPointSummaryService({} as StatisticsService);
      const layer: any = {
        scale: {
          type: 'category',
        },
      };
      expect(summaryService.canSummarize(layer)).toBe(false);
    });
  });

  describe('summarize', () => {
    it('should include statistics for current and previous timespan', () => {
      jasmine.clock().mockDate(new Date('2023-05-21T00:00'));
      const statisticsService = jasmine.createSpyObj<StatisticsService>('StatisticsService', ['getFormattedStatistics']);
      const summaryService = new ScatterDataPointSummaryService(statisticsService);
      statisticsService.getFormattedStatistics.and.callFake(() => ({
        Average: '10',
        Median: '15',
      }));
      const summary = summaryService.summarize(mockLayer, {
        min: new Date('2023-05-11T00:00').getTime(),
        max: new Date('2023-05-21T00:00').getTime(),
      });
      console.log(summary);
      expect(summary).toEqual([
        {
          [mockLayer.name]: 'Average',
          'past 10 days': '10',
          '10 - 20 days ago': '10',
        },
        {
          [mockLayer.name]: 'Median',
          'past 10 days': '15',
          '10 - 20 days ago': '15',
        },
      ]);
    });

    it('should format current and previous labels as months', () => {
      jasmine.clock().mockDate(new Date('2023-05-21T00:00'));
      const statisticsService = jasmine.createSpyObj<StatisticsService>('StatisticsService', ['getFormattedStatistics']);
      const summaryService = new ScatterDataPointSummaryService(statisticsService);
      statisticsService.getFormattedStatistics.and.callFake(() => ({
        Average: '10',
        Median: '15',
      }));
      const summary = summaryService.summarize(mockLayer, {
        months: 3,
        min: new Date('2023-02-21T00:00').getTime(),
        max: new Date('2023-05-21T00:00').getTime(),
      });
      console.log(summary);
      expect(summary).toEqual([
        {
          [mockLayer.name]: 'Average',
          'past 3 months': '10',
          '3 - 6 months ago': '10',
        },
        {
          [mockLayer.name]: 'Median',
          'past 3 months': '15',
          '3 - 6 months ago': '15',
        },
      ]);
    });

    it('should format current and previous labels as years', () => {
      jasmine.clock().mockDate(new Date('2023-05-21T00:00'));
      const statisticsService = jasmine.createSpyObj<StatisticsService>('StatisticsService', ['getFormattedStatistics']);
      const summaryService = new ScatterDataPointSummaryService(statisticsService);
      statisticsService.getFormattedStatistics.and.callFake(() => ({
        Average: '10',
        Median: '15',
      }));
      const summary = summaryService.summarize(mockLayer, {
        months: 12,
        min: new Date('2023-02-21T00:00').getTime(),
        max: new Date('2023-05-21T00:00').getTime(),
      });
      console.log(summary);
      expect(summary).toEqual([
        {
          [mockLayer.name]: 'Average',
          'past 1 year': '10',
          '1 - 2 years ago': '10',
        },
        {
          [mockLayer.name]: 'Median',
          'past 1 year': '15',
          '1 - 2 years ago': '15',
        },
      ]);
    });
  });
});
