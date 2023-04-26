import { TestBed } from '@angular/core/testing';
import { SharedDataLayerService } from './shared-data-layer.service';

describe('SharedDataLayerService', () => {
  let service: SharedDataLayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedDataLayerService],
    });
    service = TestBed.inject(SharedDataLayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get option panel value', () => {
    const value = true;
    service.setOptionPanelValue(value);
    expect(service.getOptionPanelValue()).toEqual(value);
  });
});
