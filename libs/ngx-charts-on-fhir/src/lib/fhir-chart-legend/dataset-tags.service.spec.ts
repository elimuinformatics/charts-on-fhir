import { TestBed } from '@angular/core/testing';
import { DatasetTagsService } from './dataset-tags-legend/dataset-tags.service';

describe('DatasetTagsService', () => {
  let service: DatasetTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
