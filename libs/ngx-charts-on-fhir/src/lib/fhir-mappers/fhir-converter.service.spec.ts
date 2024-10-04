import { TestBed } from '@angular/core/testing';
import { FhirConverter } from './fhir-converter.service';
import { MultiMapper } from './multi-mapper.service';

describe('FhirConverter', () => {
  let mapper: jasmine.SpyObj<MultiMapper>;
  let converter: FhirConverter;

  beforeEach(() => {
    mapper = jasmine.createSpyObj<MultiMapper>('MultiMapper', ['canMap', 'map']);
    TestBed.configureTestingModule({
      providers: [
        { provide: FhirConverter, useClass: FhirConverter },
        { provide: MultiMapper, useValue: mapper },
      ],
    });
    converter = TestBed.inject(FhirConverter);
  });

  it('should return empty list for an empty bundle', () => {
    const result = converter.convert({} as any);
    expect(result).toEqual([]);
  });

  it('should only map resources that the MultiMapper can map', () => {
    mapper.canMap.and.callFake(((r: any) => r.convertMe) as any);
    const bundle: any = {
      entry: [{ resource: { convertMe: true } }, { resource: { convertMe: false } }],
    };
    converter.convert(bundle);
    expect(mapper.map).toHaveBeenCalledWith({ convertMe: true });
    expect(mapper.map).not.toHaveBeenCalledWith({ convertMe: false });
  });
});
