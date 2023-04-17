import { TestBed } from '@angular/core/testing';
import { FhirChartTagsService } from './fhir-chart-tags.service';

describe('FhirChartTagsService', () => {
  let service: FhirChartTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirChartTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
