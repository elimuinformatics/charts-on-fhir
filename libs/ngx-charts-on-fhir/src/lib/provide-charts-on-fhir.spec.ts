import { COLOR_PALETTE, DataLayerColorService } from './data-layer/data-layer-color.service';
import { DataLayerManagerService, DataLayerService } from './data-layer/data-layer-manager.service';
import { DataLayerMergeService } from './data-layer/data-layer-merge.service';
import { SummaryService } from './fhir-chart-summary/summary.service';
import { FhirChartConfigurationService } from './fhir-chart/fhir-chart-configuration.service';
import { FhirConverter } from './fhir-mappers/fhir-converter.service';
import { Mapper, MultiMapper } from './fhir-mappers/multi-mapper.service';
import { ReferenceRangeService } from './fhir-mappers/observation/reference-range.service';
import { provideChartsOnFhir, withColors, withDataLayerServices, withMappers, withSummaryServices } from './provide-charts-on-fhir';

describe('provideChartsOnFhir', () => {
  it('should return an array of providers', () => {
    const MyMapper = {} as any;
    const MyDataLayerService = {} as any;
    const MySummaryService = {} as any;
    const expectedProviders = [
      DataLayerManagerService,
      DataLayerMergeService,
      DataLayerColorService,
      FhirChartConfigurationService,
      FhirConverter,
      MultiMapper,
      ReferenceRangeService,
      [{ provide: DataLayerService, useClass: MyDataLayerService, multi: true }],
      [MyMapper, { provide: Mapper, useClass: MyMapper, multi: true }],
      [{ provide: SummaryService, useClass: MySummaryService, multi: true }],
      [{ provide: COLOR_PALETTE, useValue: ['#000000'] }],
    ];
    const actualProviders = provideChartsOnFhir(
      withDataLayerServices(MyDataLayerService),
      withMappers(MyMapper),
      withSummaryServices(MySummaryService),
      withColors('#000000')
    );
    expect(actualProviders).toEqual(jasmine.arrayWithExactContents(expectedProviders));
  });
});
