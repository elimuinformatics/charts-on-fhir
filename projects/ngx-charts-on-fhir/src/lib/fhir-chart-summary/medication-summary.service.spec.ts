import { MedicationDataPoint, MILLISECONDS_PER_DAY } from "../../public-api";
import { DataLayer } from "../data-layer/data-layer";
import { MedicationSummaryService } from "./medication-summary.service";

describe('MedicationSummaryService', () => {
  describe('canSummarize', () => {
    it('should return true for layer with medication scale', () => {
      const summaryService = new MedicationSummaryService();
      const layer: any = {
        scale: {
          type: 'medication',
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
        scale: { id: 'medications', type: 'medication' },
      };
      const summary = summaryService.summarize(layer);
      expect(summary).toEqual([
        {
          'Medications': 'one',
          'Date Written': '1 Jan 2023',
        },
      ]);
    });
  });
});
