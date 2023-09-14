import { TestBed } from '@angular/core/testing';
import { Encounter } from 'fhir/r4';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { EncounterMapper, MappableEncounter } from './encounter-mapper.service';

describe('EncounterMapper', () => {
  let mapper: EncounterMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CATEGORY_SCALE_OPTIONS, useValue: { type: 'category' } }],
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
  });
});
