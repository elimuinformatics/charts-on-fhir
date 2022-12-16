import { hot } from 'jasmine-marbles';
import { ManagedDataLayer } from './data-layer';
import { VisibleDataService } from './visible-data.service';

describe('FhirChartSummaryService', () => {
  describe('visible$', () => {
    it('should emit when selectedLayers$ changes', () => {
      const a: Partial<ManagedDataLayer>[] = [
        {
          name: 'One',
          enabled: true,
          datasets: [{ data: [] }],
        },
      ];
      const b: Partial<ManagedDataLayer>[] = [
        {
          name: 'One',
          enabled: true,
          datasets: [{ data: [] }],
        },
        {
          name: 'Two',
          enabled: true,
          datasets: [{ data: [] }],
        },
      ];
      const manager: any = {
        selectedLayers$: hot('ab', { a, b }),
        timelineRange$: hot('r', { r: { min: 0, max: 10 } }),
      };
      const service = new VisibleDataService(manager);
      expect(service.visible$).toBeObservable(
        hot('xy', {
          x: a.map((layer) => jasmine.objectContaining({ layer })),
          y: b.map((layer) => jasmine.objectContaining({ layer })),
        })
      );
    });

    it('should only emit enabled layers', () => {
      const layers = [
        {
          name: 'Yes',
          enabled: true,
          datasets: [{ data: [] }],
        },
        {
          name: 'Nope',
          enabled: false,
          datasets: [{ data: [] }],
        },
      ];
      const manager: any = {
        selectedLayers$: hot('a', { a: layers }),
        timelineRange$: hot('r', { r: { min: 0, max: 10 } }),
      };
      const service = new VisibleDataService(manager);
      expect(service.visible$).toBeObservable(
        hot('x', {
          x: [
            jasmine.objectContaining({
              layer: jasmine.objectContaining({ name: 'Yes' }),
            }),
          ],
        })
      );
    });

    it('should not emit hidden datasets', () => {
      const layers = [
        {
          name: 'Layer',
          enabled: true,
          datasets: [
            { label: 'Yes', hidden: false, data: [] },
            { label: 'No', hidden: true, data: [] },
          ],
        },
      ];
      const manager: any = {
        selectedLayers$: hot('a', { a: layers }),
        timelineRange$: hot('r', { r: { min: 0, max: 10 } }),
      };
      const service = new VisibleDataService(manager);
      expect(service.visible$).toBeObservable(
        hot('x', {
          x: [
            jasmine.objectContaining({
              dataset: jasmine.objectContaining({ label: 'Yes' }),
            }),
          ],
        })
      );
    });

    it('should sort datasets in descending order by most recent y-value', () => {
      const layers = [
        {
          name: 'Layer',
          enabled: true,
          datasets: [
            { label: '1', data: [{ y: 0 }, { y: 1 }] },
            { label: '3', data: [{ y: 0 }, { y: 3 }] },
            { label: '2', data: [{ y: 0 }, { y: 2 }] },
          ],
        },
      ];
      const manager: any = {
        selectedLayers$: hot('a', { a: layers }),
        timelineRange$: hot('r', { r: { min: 0, max: 10 } }),
      };
      const service = new VisibleDataService(manager);
      expect(service.visible$).toBeObservable(
        hot('x', {
          x: [
            jasmine.objectContaining({
              dataset: jasmine.objectContaining({ label: '3' }),
            }),
            jasmine.objectContaining({
              dataset: jasmine.objectContaining({ label: '2' }),
            }),
            jasmine.objectContaining({
              dataset: jasmine.objectContaining({ label: '1' }),
            }),
          ],
        })
      );
    });

    it('should only emit data that falls within dateRange', () => {
      const layers = [
        {
          name: 'Layer',
          enabled: true,
          datasets: [{ data: [{ x: 0 }, { x: 2 }, { x: 3 }, { x: 5 }] }],
        },
      ];
      const manager: any = {
        selectedLayers$: hot('a', { a: layers }),
        timelineRange$: hot('rs', { r: { min: 2, max: 3 }, s: { min: 4, max: 6 } }),
      };
      const service = new VisibleDataService(manager);
      expect(service.visible$).toBeObservable(
        hot('xy', {
          x: [
            jasmine.objectContaining({
              data: [{ x: 2 }, { x: 3 }],
            }),
          ],
          y: [
            jasmine.objectContaining({
              data: [{ x: 5 }],
            }),
          ],
        })
      );
    });
  });
});
