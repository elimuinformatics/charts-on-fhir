import { TestBed } from '@angular/core/testing';

import { NgxChartsOnFhirService } from './ngx-charts-on-fhir.service';

describe('NgxChartsOnFhirService', () => {
  let service: NgxChartsOnFhirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxChartsOnFhirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
