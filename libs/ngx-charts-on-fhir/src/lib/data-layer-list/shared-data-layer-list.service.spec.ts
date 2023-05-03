import { TestBed } from '@angular/core/testing';
import { SharedDataLayerListService } from './shared-data-layer-list.service';

describe('SharedDataLayerListService', () => {
  let service: SharedDataLayerListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedDataLayerListService],
    });
    service = TestBed.inject(SharedDataLayerListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
