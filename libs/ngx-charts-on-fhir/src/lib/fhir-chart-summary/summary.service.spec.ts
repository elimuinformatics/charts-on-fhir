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
          'most recent 10 days': '10',
          'prior 10 days': '10',
        },
        {
          [mockLayer.name]: 'Median',
          'most recent 10 days': '15',
          'prior 10 days': '15',
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

      expect(summary).toEqual([
        {
          [mockLayer.name]: 'Average',
          'most recent 3 months': '10',
          'prior 3 months': '10',
        },
        {
          [mockLayer.name]: 'Median',
          'most recent 3 months': '15',
          'prior 3 months': '15',
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
          'most recent 1 year': '10',
          'prior 1 year': '10',
        },
        {
          [mockLayer.name]: 'Median',
          'most recent 1 year': '15',
          'prior 1 year': '15',
        },
      ]);
    });

    it('should group a dataset of layer based on chartOnfhir group property', () => {
      const statisticsService = jasmine.createSpyObj<StatisticsService>('StatisticsService', ['getFormattedStatistics']);
      const summaryService = new ScatterDataPointSummaryService(statisticsService);
      statisticsService.getFormattedStatistics.and.callFake(() => ({
        Average: '10',
        Median: '15',
      }));
      const layer: any = {
        name: 'BP',

        datasets: [
          {
            label: 'Systolic',
            data: [{ x: 1, y: 2 }],
            chartsOnFhir: {
              group: 'group 1',
            },
          },
          {
            label: 'Diastolic',
            data: [{ x: 2, y: 3 }],
            chartsOnFhir: {
              group: 'group 2',
            },
          },
          {
            label: 'Systolic',
            data: [{ x: 4, y: 5 }],
            chartsOnFhir: {
              group: 'group 1',
            },
          },
        ],
      };

      const monthRange = {
        months: 12,
        min: new Date('2023-02-21T00:00').getTime(),
        max: new Date('2023-05-21T00:00').getTime(),
      };
      summaryService.summarize(layer, monthRange);

      const expectedLayer: any = {
        name: 'BP',
        datasets: [
          {
            label: 'group 1',
            data: [
              { x: 1, y: 2 },
              { x: 4, y: 5 },
            ],
            chartsOnFhir: {
              group: 'group 1',
            },
          },
          {
            label: 'group 2',
            data: [{ x: 2, y: 3 }],
            chartsOnFhir: {
              group: 'group 2',
            },
          },
        ],
      };
      expect(statisticsService.getFormattedStatistics).toHaveBeenCalledWith(expectedLayer, monthRange);
    });
  });
});
