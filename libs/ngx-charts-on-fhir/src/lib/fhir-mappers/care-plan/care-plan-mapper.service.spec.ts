import { TestBed } from '@angular/core/testing';
import { CarePlan } from 'fhir/r4';
import { CATEGORY_SCALE_OPTIONS } from '../fhir-mapper-options';
import { CarePlanMapper, MappableCarePlan, isMappableCarePlan } from './care-plan-mapper.service';

describe('isMappableCarePlan', () => {
  it('should return true for status "active" with period.start', () => {
    const resource: CarePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      intent: 'plan',
      subject: {},
      period: { start: '2023-01-01' },
    };
    expect(isMappableCarePlan(resource)).toBe(true);
  });

  it('should return true for status "ended" with period.start', () => {
    const resource = {
      resourceType: 'CarePlan',
      status: 'ended',
      intent: 'plan',
      subject: {},
      period: { start: '2023-01-01' },
    } as unknown as CarePlan;
    expect(isMappableCarePlan(resource)).toBe(true);
  });

  it('should return true for status "completed" with period.start', () => {
    const resource: CarePlan = {
      resourceType: 'CarePlan',
      status: 'completed',
      intent: 'plan',
      subject: {},
      period: { start: '2023-01-01' },
    };
    expect(isMappableCarePlan(resource)).toBe(true);
  });

  it('should return false for status "draft"', () => {
    const resource: CarePlan = {
      resourceType: 'CarePlan',
      status: 'draft',
      intent: 'plan',
      subject: {},
      period: { start: '2023-01-01' },
    };
    expect(isMappableCarePlan(resource)).toBe(false);
  });

  it('should return false for status "revoked"', () => {
    const resource: CarePlan = {
      resourceType: 'CarePlan',
      status: 'revoked',
      intent: 'plan',
      subject: {},
      period: { start: '2023-01-01' },
    };
    expect(isMappableCarePlan(resource)).toBe(false);
  });

  it('should return false for status "unknown"', () => {
    const resource: CarePlan = {
      resourceType: 'CarePlan',
      status: 'unknown',
      intent: 'plan',
      subject: {},
      period: { start: '2023-01-01' },
    };
    expect(isMappableCarePlan(resource)).toBe(false);
  });

  it('should return false when period.start is missing', () => {
    const resource: CarePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      intent: 'plan',
      subject: {},
    };
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
      const resource: MappableCarePlan = {
        resourceType: 'CarePlan',
        status: 'active',
        intent: 'plan',
        subject: {},
        period: { start: '2023-01-01' },
      };
      expect(mapper.canMap(resource)).toBe(true);
    });

    it('should return false for a CarePlan with disallowed status', () => {
      const resource: CarePlan = {
        resourceType: 'CarePlan',
        status: 'draft',
        intent: 'plan',
        subject: {},
        period: { start: '2023-01-01' },
      };
      expect(mapper.canMap(resource)).toBe(false);
    });
  });

  describe('map', () => {
    const start = '2023-01-01T00:00:00.000Z';
    const end = '2023-06-01T00:00:00.000Z';
    const baseResource: MappableCarePlan = {
      resourceType: 'CarePlan',
      status: 'active',
      intent: 'plan',
      subject: {},
      title: 'Diabetes Management',
      period: { start, end },
    };

    it('should return a layer with care-plan category', () => {
      expect(mapper.map(baseResource).category?.[0]).toEqual('care-plan');
    });

    it('should return a dataset of type "bar"', () => {
      expect(mapper.map(baseResource).datasets[0].type).toEqual('bar');
    });

    it('should map period.start to x[0] in milliseconds', () => {
      const layer = mapper.map(baseResource);
      const x = layer.datasets[0].data[0].x as [number, number];
      expect(x[0]).toEqual(new Date(start).getTime());
    });

    it('should map period.end to x[1] in milliseconds', () => {
      const layer = mapper.map(baseResource);
      const x = layer.datasets[0].data[0].x as [number, number];
      expect(x[1]).toEqual(new Date(end).getTime());
    });

    it('should use resource.title as the dataset label', () => {
      expect(mapper.map(baseResource).datasets[0].label).toEqual('Diabetes Management');
    });

    it('should fall back to "Care Plan" when title is missing', () => {
      const resource: MappableCarePlan = { ...baseResource, title: undefined };
      expect(mapper.map(resource).datasets[0].label).toEqual('Care Plan');
    });

    it('should include status in the tooltip', () => {
      const layer = mapper.map(baseResource);
      const tooltip = layer.datasets[0].data[0].tooltip as string[];
      expect(tooltip.some((t) => t.includes('active'))).toBe(true);
    });

    it('should use current time as x[1] when period.end is missing', () => {
      const before = Date.now();
      const resource: MappableCarePlan = { ...baseResource, period: { start } };
      const layer = mapper.map(resource);
      const after = Date.now();
      const x = layer.datasets[0].data[0].x as [number, number];
      expect(x[1]).toBeGreaterThanOrEqual(before);
      expect(x[1]).toBeLessThanOrEqual(after);
    });
  });
});
