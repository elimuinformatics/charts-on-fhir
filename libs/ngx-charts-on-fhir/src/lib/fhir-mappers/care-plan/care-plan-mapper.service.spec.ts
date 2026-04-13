import { TestBed } from '@angular/core/testing';
import { CarePlan } from 'fhir/r4';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { CarePlanMapper, MappableCarePlan, isMappableCarePlan } from './care-plan-mapper.service';

const BASE_CARE_PLAN: CarePlan = {
  resourceType: 'CarePlan',
  status: 'active',
  intent: 'plan',
  subject: { reference: 'Patient/1' },
};

describe('isMappableCarePlan', () => {
  it('should return true for active status with period.start', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'active', period: { start: '2023-01-01' } };
    expect(isMappableCarePlan(plan)).toBe(true);
  });

  it('should return true for completed status with period.start', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'completed', period: { start: '2023-01-01' } };
    expect(isMappableCarePlan(plan)).toBe(true);
  });

  it('should return true for ended status with period.start', () => {
    const plan = { ...BASE_CARE_PLAN, status: 'ended', period: { start: '2023-01-01' } } as unknown as CarePlan;
    expect(isMappableCarePlan(plan)).toBe(true);
  });

  it('should return false for draft status', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'draft', period: { start: '2023-01-01' } };
    expect(isMappableCarePlan(plan)).toBe(false);
  });

  it('should return false for on-hold status', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'on-hold', period: { start: '2023-01-01' } };
    expect(isMappableCarePlan(plan)).toBe(false);
  });

  it('should return false for revoked status', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'revoked', period: { start: '2023-01-01' } };
    expect(isMappableCarePlan(plan)).toBe(false);
  });

  it('should return false for entered-in-error status', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'entered-in-error', period: { start: '2023-01-01' } };
    expect(isMappableCarePlan(plan)).toBe(false);
  });

  it('should return false when period.start is missing', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'active', period: {} };
    expect(isMappableCarePlan(plan)).toBe(false);
  });

  it('should return false when period is missing', () => {
    const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'active' };
    expect(isMappableCarePlan(plan)).toBe(false);
  });

  it('should return false for a non-CarePlan resource', () => {
    const resource = { resourceType: 'Encounter', status: 'active', period: { start: '2023-01-01' } } as unknown as CarePlan;
    expect(isMappableCarePlan(resource)).toBe(false);
  });
});

describe('CarePlanMapper', () => {
  let mapper: CarePlanMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CATEGORY_SCALE_OPTIONS, useValue: { type: 'category' } }, CarePlanMapper],
    });
    mapper = TestBed.inject(CarePlanMapper);
  });

  describe('canMap', () => {
    it('should return true for a MappableCarePlan', () => {
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start: '2023-01-01' },
      };
      expect(mapper.canMap(plan)).toBe(true);
    });

    it('should return false for a CarePlan with draft status', () => {
      const plan: CarePlan = { ...BASE_CARE_PLAN, status: 'draft', period: { start: '2023-01-01' } };
      expect(mapper.canMap(plan)).toBe(false);
    });
  });

  describe('map', () => {
    it('should return a layer with care-plan category', () => {
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start: '2023-01-01' },
      };
      expect(mapper.map(plan).category?.[0]).toEqual('care-plan');
    });

    it('should use title from resource when provided', () => {
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        title: 'Diabetes Management',
        status: 'active',
        period: { start: '2023-01-01' },
      };
      const layer = mapper.map(plan);
      expect(layer.datasets[0].label).toEqual('Diabetes Management');
    });

    it('should fall back to "Care Plan" label when title is missing', () => {
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start: '2023-01-01' },
      };
      const layer = mapper.map(plan);
      expect(layer.datasets[0].label).toEqual('Care Plan');
    });

    it('should map period.start to x[0] in milliseconds', () => {
      const start = '2023-01-01T00:00:00';
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start },
      };
      const layer = mapper.map(plan);
      const x = layer.datasets[0].data[0].x as [number, number];
      expect(x[0]).toEqual(new Date(start).getTime());
    });

    it('should map period.end to x[1] in milliseconds when provided', () => {
      const start = '2023-01-01';
      const end = '2023-06-30';
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'completed',
        period: { start, end },
      };
      const layer = mapper.map(plan);
      const x = layer.datasets[0].data[0].x as [number, number];
      expect(x[1]).toEqual(new Date(end).getTime());
    });

    it('should use current time as end when period.end is missing', () => {
      const start = '2023-01-01';
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start },
      };
      const before = Date.now();
      const layer = mapper.map(plan);
      const after = Date.now();
      const x = layer.datasets[0].data[0].x as [number, number];
      expect(x[1]).toBeGreaterThanOrEqual(before);
      expect(x[1]).toBeLessThanOrEqual(after);
    });

    it('should include status in tooltip', () => {
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start: '2023-01-01' },
      };
      const layer = mapper.map(plan);
      const tooltip = layer.datasets[0].data[0].tooltip as string[];
      expect(tooltip.some((t) => t.includes('active'))).toBe(true);
    });

    it('should produce a bar chart dataset type', () => {
      const plan: MappableCarePlan = {
        ...BASE_CARE_PLAN,
        status: 'active',
        period: { start: '2023-01-01' },
      };
      expect(mapper.map(plan).datasets[0].type).toEqual('bar');
    });
  });
});
