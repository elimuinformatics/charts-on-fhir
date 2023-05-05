import { DataLayer } from '../data-layer/data-layer';
import { MedicationDataPoint } from '../fhir-mappers/medication-request/simple-medication-mapper.service';
import { MILLISECONDS_PER_DAY } from '../utils';
import { MedicationSummaryService } from './medication-summary.service';

describe('MedicationSummaryService', () => {
  describe('canSummarize', () => {
    it('should return true for layer with category scale', () => {
      const summaryService = new MedicationSummaryService();
      const layer: any = {
        scale: {
          type: 'category',
        },
      };
      expect(summaryService.canSummarize(layer)).toBe(true);
    });

    it('should return false for layer with linear scale', () => {
      const summaryService = new MedicationSummaryService();
      const layer: any = {
        scale: {
          type: 'linear',
        },
      };
      expect(summaryService.canSummarize(layer)).toBe(false);
    });
  });

  describe('summarize', () => {
    it('should include authoredOn date', () => {
      const summaryService = new MedicationSummaryService();
      const authoredOn = new Date('2023-01-01T00:00:00').getTime();
      const layer: DataLayer<'line', MedicationDataPoint[]> = {
        name: 'Medications',
        datasets: [
          {
            label: 'one',
            data: [
              { x: authoredOn, y: 'one', authoredOn },
              { x: authoredOn + 30 * MILLISECONDS_PER_DAY, y: 'one', authoredOn },
              { x: NaN, y: 'one', authoredOn },
            ],
          },
        ],
        scale: { id: 'medications', type: 'category' },
      };
      const summary = summaryService.summarize(layer);
      expect(summary).toEqual([
        {
          Medications: 'one',
          'First Written': '1 Jan 2023',
          'Last Written': '1 Jan 2023',
        },
      ]);
    });
  });
});
