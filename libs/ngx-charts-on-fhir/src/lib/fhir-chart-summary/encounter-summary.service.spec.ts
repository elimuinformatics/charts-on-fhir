import { EncounterSummaryService } from './encounter-summary.service';

describe('EncounterSummaryService', () => {
  describe('canSummarize', () => {
    it('should return true for layer with encounter category', () => {
      const summaryService = new EncounterSummaryService();
      const start = new Date('2023-01-01T13:30:00').getTime();
      const layer: any = {
        category: ['encounter'],
        datasets: [
          {
            data: [{ x: start, y: 'Encounter', resource: { resourceType: 'Encounter', period: { start } } }],
          },
        ],
      };
      expect(summaryService.canSummarize(layer)).toBe(true);
    });
  });
  it('should return false for layer with medication category', () => {
    const summaryService = new EncounterSummaryService();
    const start = new Date('2023-01-01T13:30:00').getTime();
    const layer: any = {
      category: ['medication'],
      datasets: [
        {
          data: [{ x: start, y: 'Encounter', resource: { resourceType: 'Encounter', period: { start } } }],
        },
      ],
    };
    expect(summaryService.canSummarize(layer)).toBe(false);
  });

  describe('summarize', () => {
    it('should include type, start, end', () => {
      const summaryService = new EncounterSummaryService();
      const start = new Date('2023-01-01T13:30:00').getTime();
      const end = new Date('2023-01-01T14:30:00').getTime();
      const layer: any = {
        name: 'Encounters',
        category: ['encounter'],
        datasets: [
          {
            label: 'Encounter',
            data: [
              {
                x: start,
                y: 'Encounter',
                resource: {
                  type: [{ text: 'Follow Up' }],
                  period: { start, end },
                },
              },
            ],
          },
        ],
        scale: { id: 'encounters', type: 'category' },
      };
      const summary = summaryService.summarize(layer);
      expect(summary).toEqual([
        {
          'Most Recent Encounter': 'Type',
          '': 'Follow Up',
        },
        {
          'Most Recent Encounter': 'Start',
          '': '1 Jan 2023 1:30 PM',
        },
        {
          'Most Recent Encounter': 'End',
          '': '1 Jan 2023 2:30 PM',
        },
      ]);
    });
  });
});
