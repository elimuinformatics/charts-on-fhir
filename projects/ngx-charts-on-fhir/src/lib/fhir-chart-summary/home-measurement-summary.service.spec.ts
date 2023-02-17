import { TestBed } from '@angular/core/testing';
import { DataLayer } from '../data-layer/data-layer';
import { HomeMeasurementSummaryService, HOME_DATASET_LABEL_SUFFIX } from './home-measurement-summary.service';
import { ScatterDataPointSummaryService } from './summary.service';

describe('HomeMeasurementSummaryService', () => {
  let baseSummaryService: jasmine.SpyObj<ScatterDataPointSummaryService>;
  let summaryService: HomeMeasurementSummaryService;

  beforeEach(() => {
    baseSummaryService = jasmine.createSpyObj('ScatterDataPointSummaryService', ['canSummarize', 'summarize']);
    baseSummaryService.canSummarize.and.returnValue(true);
    TestBed.configureTestingModule({
      providers: [{ provide: ScatterDataPointSummaryService, useValue: baseSummaryService }],
    });
    summaryService = TestBed.inject(HomeMeasurementSummaryService);
  });

  describe('canSummarize', () => {
    it('should return true if a dataset has the Home suffix', () => {
      const layer: any = {
        datasets: [
          {
            label: 'Test' + HOME_DATASET_LABEL_SUFFIX,
          },
        ],
      };
      expect(summaryService.canSummarize(layer)).toBe(true);
    });

    it('should return true if no dataset has the Home suffix', () => {
      const layer: any = {
        datasets: [
          {
            label: 'Test',
          },
        ],
      };
      expect(summaryService.canSummarize(layer)).toBe(false);
    });
  });

  describe('summarize', () => {
    it('should combine matching datasets', () => {
      const layer: any = {
        datasets: [
          {
            label: 'Test',
            data: [{ x: 1, y: 1 }],
          },
          {
            label: 'Test' + HOME_DATASET_LABEL_SUFFIX,
            data: [{ x: 2, y: 2 }],
          },
        ],
      };
      const expectedCombinedLayer = {
        datasets: [
          {
            label: 'Test',
            data: [
              { x: 1, y: 1 },
              { x: 2, y: 2 },
            ],
          },
        ],
      } as DataLayer;
      summaryService.summarize(layer as DataLayer, { min: 0, max: 2 });
      expect(baseSummaryService.summarize).toHaveBeenCalledWith(expectedCombinedLayer, { min: 0, max: 2 });
    });

    it('should not combine datasets that do not match', () => {
      const layer: any = {
        datasets: [
          {
            label: 'Test',
            data: [{ x: 1, y: 1 }],
          },
          {
            label: 'Different' + HOME_DATASET_LABEL_SUFFIX,
            data: [{ x: 2, y: 2 }],
          },
        ],
      };
      const expectedCombinedLayer = {
        datasets: [
          {
            label: 'Test',
            data: [{ x: 1, y: 1 }],
          },
          {
            label: 'Different',
            data: [{ x: 2, y: 2 }],
          },
        ],
      } as DataLayer;
      summaryService.summarize(layer as DataLayer, { min: 0, max: 2 });
      expect(baseSummaryService.summarize).toHaveBeenCalledWith(expectedCombinedLayer, { min: 0, max: 2 });
    });

    it('should use original label regardless of dataset order', () => {
      const layer: any = {
        datasets: [
          {
            label: 'Test' + HOME_DATASET_LABEL_SUFFIX,
            data: [{ x: 2, y: 2 }],
          },
          {
            label: 'Test',
            data: [{ x: 1, y: 1 }],
          },
        ],
      };
      const expectedCombinedLayer: any = {
        datasets: [
          jasmine.objectContaining({
            label: 'Test',
          }),
        ],
      };
      summaryService.summarize(layer as DataLayer, { min: 0, max: 2 });
      expect(baseSummaryService.summarize).toHaveBeenCalledWith(expectedCombinedLayer, { min: 0, max: 2 });
    });
  });
});
