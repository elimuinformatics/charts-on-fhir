import { TestBed } from '@angular/core/testing';
import { FhirChartTagsService } from './fhir-chart-tags.service';
import { hot } from 'jasmine-marbles';
import { Dataset } from '../../data-layer/data-layer';

describe('FhirChartTagsService', () => {
  let service: FhirChartTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirChartTagsService);
  });

  it('should set default styles for Home and Clinic tags', () => {
    expect(service.tagStyles$).toBeObservable(
      hot('x', {
        x: jasmine.objectContaining({
          Home: jasmine.anything(),
          Clinic: jasmine.anything(),
        }),
      })
    );
  });

  describe('setTagStyles', () => {
    it('should add new styles', () => {
      service.setTagStyles({
        TagOne: {
          pointStyle: 'triangle',
        },
        TagTwo: {
          pointStyle: 'cross',
        },
      });
      expect(service.tagStyles$).toBeObservable(
        hot('x', {
          x: jasmine.objectContaining({
            Home: jasmine.anything(),
            Clinic: jasmine.anything(),
            TagOne: { pointStyle: 'triangle' },
            TagTwo: { pointStyle: 'cross' },
          }),
        })
      );
    });
    it('should replace old styles', () => {
      service.setTagStyles({
        Home: {
          pointRadius: 10,
        },
        Clinic: {
          pointRadius: 20,
        },
      });
      expect(service.tagStyles$).toBeObservable(
        hot('x', {
          x: jasmine.objectContaining({
            Home: { pointRadius: 10 },
            Clinic: { pointRadius: 20 },
          }),
        })
      );
    });
  });

  describe('applyTagStyles', () => {
    it('should only apply matching tag styles to the dataset', () => {
      const dataset: Dataset = {
        label: 'One',
        data: [],
        pointRadius: 3,
        chartsOnFhir: {
          tags: ['TagOne'],
        },
      };
      service.setTagStyles({
        TagOne: {
          pointStyle: 'triangle',
        },
        TagTwo: {
          pointRadius: 55, // should not be applied
        },
      });
      service.applyTagStyles(dataset);
      expect(dataset.pointStyle).toBe('triangle');
      expect(dataset.pointRadius).toBe(3);
    });
  });
});
