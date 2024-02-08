import { TestBed } from '@angular/core/testing';
import { ANNOTATION_OPTIONS, LINE_ANNOTATION_OPTIONS } from '../fhir-mapper-options';
import { ReferenceRangeService } from './reference-range.service';

describe('ReferenceRangeService', () => {
  let service: ReferenceRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ANNOTATION_OPTIONS, useValue: { type: 'box' } },
        { provide: LINE_ANNOTATION_OPTIONS, useValue: { type: 'line' } },
      ],
    });
    service = TestBed.inject(ReferenceRangeService);
  });

  describe('getAnnotationLabel', () => {
    it('should return the label for a range with low and high values', () => {
      expect(service.getAnnotationLabel({ low: { value: 1 }, high: { value: 2 } }, 'Name')).toBe('Name Reference Range');
    });

    it('should return the label for a range with only a high value', () => {
      expect(service.getAnnotationLabel({ high: { value: 2 } }, 'Name')).toBe('Name Upper Limit');
    });

    it('should return the label for a range with only a low value', () => {
      expect(service.getAnnotationLabel({ low: { value: 1 } }, 'Name')).toBe('Name Lower Limit');
    });

    it('should return undefined for a range with no values', () => {
      expect(service.getAnnotationLabel({}, 'Name')).toBeUndefined();
    });
  });

  describe('createReferenceRangeAnnotation', () => {
    it('should return a box annotation for a range with low and high values', () => {
      const annotation = service.createReferenceRangeAnnotation({ low: { value: 1 }, high: { value: 2 } }, 'Name', 'y');
      expect(annotation).toEqual({ type: 'box', id: 'Name Reference Range', label: { content: 'Name Reference Range' }, yScaleID: 'y', yMax: 2, yMin: 1 });
    });

    it('should return a line annotation for a range with only a high value', () => {
      const annotation = service.createReferenceRangeAnnotation({ high: { value: 2 } }, 'Name', 'y');
      expect(annotation).toEqual({ type: 'line', id: 'Name Upper Limit', label: { content: 'Name Upper Limit' }, scaleID: 'y', value: 2 });
    });

    it('should return a line annotation for a range with only a low value', () => {
      const annotation = service.createReferenceRangeAnnotation({ low: { value: 1 } }, 'Name', 'y');
      expect(annotation).toEqual({ type: 'line', id: 'Name Lower Limit', label: { content: 'Name Lower Limit' }, scaleID: 'y', value: 1 });
    });

    it('should return undefined for a range with no values', () => {
      expect(service.createReferenceRangeAnnotation({}, 'Name', 'y')).toBeUndefined();
    });
  });
});
