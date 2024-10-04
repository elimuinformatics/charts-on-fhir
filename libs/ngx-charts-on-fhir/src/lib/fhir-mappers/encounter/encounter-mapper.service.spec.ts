import { TestBed } from '@angular/core/testing';
import { Encounter } from 'fhir/r4';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { EncounterMapper, MappableEncounter } from './encounter-mapper.service';
import { PointStyle } from 'chart.js';

describe('EncounterMapper', () => {
  let mapper: EncounterMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CATEGORY_SCALE_OPTIONS, useValue: { type: 'category' } },
        { provide: EncounterMapper, useClass: EncounterMapper },
      ],
    });
    mapper = TestBed.inject(EncounterMapper);
  });

  describe('canMap', () => {
    it('should return true for a MappableEncounter', () => {
      const encounter: MappableEncounter = {
        resourceType: 'Encounter',
        class: { code: 'test' },
        status: 'finished',
        period: { start: '2023-01-01T13:30:00' },
      };
      expect(mapper.canMap(encounter)).toBe(true);
    });

    it('should return false for an Encounter with no period start', () => {
      const encounter: Encounter = {
        resourceType: 'Encounter',
        class: { code: 'test' },
        status: 'finished',
      };
      expect(mapper.canMap(encounter)).toBe(false);
    });
  });

  describe('map', () => {
    it('should return a layer with encounter category', () => {
      const start = '2023-01-01T13:30:00';
      const encounter: MappableEncounter = {
        resourceType: 'Encounter',
        class: { code: 'test' },
        status: 'finished',
        period: { start },
      };
      expect(mapper.map(encounter).category?.[0]).toEqual('encounter');
    });

    it('should map period.start to x value in milliseconds', () => {
      const start = '2023-01-01T13:30:00';
      const encounter: MappableEncounter = {
        resourceType: 'Encounter',
        class: { code: 'test' },
        status: 'finished',
        period: { start },
      };
      expect(mapper.map(encounter).datasets[0].data[0].x).toEqual(new Date(start).getTime());
    });

    it('should use a custom icon for AMB encounter class', () => {
      const start = '2023-01-01T13:30:00';
      const resource: MappableEncounter = {
        resourceType: 'Encounter',
        class: { code: 'AMB' },
        status: 'finished',
        period: { start },
      };
      const layer = mapper.map(resource);
      expect(typeof layer.datasets[0].pointStyle).toEqual('function');
      const pointStyle = layer.datasets[0].pointStyle as (ctx: any) => PointStyle;
      const ctx = {
        dataIndex: 0,
        dataset: layer.datasets[0],
      };
      expect(pointStyle(ctx)).toBeInstanceOf(HTMLImageElement);
    });

    it('should set icon color to dataset pointBackgroundColor', () => {
      const start = '2023-01-01T13:30:00';
      const resource: MappableEncounter = {
        resourceType: 'Encounter',
        class: { code: 'AMB' },
        status: 'finished',
        period: { start },
      };
      const layer = mapper.map(resource);
      expect(typeof layer.datasets[0].pointStyle).toEqual('function');
      const pointStyle = layer.datasets[0].pointStyle as (ctx: any) => PointStyle;
      const ctx = {
        dataIndex: 0,
        dataset: {
          ...layer.datasets[0],
          pointBackgroundColor: '#ff0000',
        },
      };
      const image = pointStyle(ctx) as HTMLImageElement;
      expect(image.src).toContain(encodeURIComponent('style="fill:#ff0000"'));
    });
  });
});
