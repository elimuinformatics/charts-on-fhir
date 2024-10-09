import { TestBed } from '@angular/core/testing';
import { Mapper, MultiMapper } from './multi-mapper.service';

describe('MultiMapper', () => {
  let mappers: jasmine.SpyObj<Mapper<any, any, any[]>>[];
  let multiMapper: MultiMapper;

  beforeEach(() => {
    mappers = [];
    for (let i = 0; i < 3; i++) {
      mappers.push(jasmine.createSpyObj<Mapper<any, any, any[]>>('Mapper', ['canMap', 'map']));
    }
    TestBed.configureTestingModule({
      providers: [{ provide: Mapper, useValue: mappers }, MultiMapper],
    });
    multiMapper = TestBed.inject(MultiMapper);
  });

  describe('canMap', () => {
    it('should return false if no mapper can map the resource', () => {
      expect(multiMapper.canMap({})).toBe(false);
    });

    it('should return true if at least one mapper can map the resource', () => {
      mappers[1].canMap.and.returnValue(true);
      expect(multiMapper.canMap({})).toBe(true);
    });
  });

  describe('map', () => {
    it('should call the first mapper that can map the resource', () => {
      mappers[1].canMap.and.returnValue(true);
      mappers[2].canMap.and.returnValue(true);
      multiMapper.map('resource');
      expect(mappers[1].map).toHaveBeenCalledWith('resource');
    });

    it('should throw an error if no mapper can map the resource', () => {
      expect(() => multiMapper.map('resource')).toThrowError();
    });
  });
});
