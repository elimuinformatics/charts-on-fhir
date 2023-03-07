# {{ NgDocPage.title }}

## Implement a DataLayerService

Applications should implement at least one `DataLayerService`.
These services are responsible for retrieving data and converting it into `DataLayer` objects.
The Charts-on-FHIR library provides some helpful services that you can use:

- `FhirDataService` retrieves data for the current patient from the FHIR server
- `FhirConverter` converts FHIR bundles into `DataLayer` objects

Here is an example of a service that retrieves all Observations for the current patient.

```ts
// observation-layer.service.ts
@Injectable({ providedIn: "root" })
export class ObservationLayerService implements DataLayerService {
  constructor(private fhir: FhirDataService, private converter: FhirConverter) {}
  name = "Observations";
  retrieve = () => {
    return this.fhir
      .getPatientData<Observation>("Observation")
      .pipe(mergeMap((bundle) => from(this.converter.convert(bundle))));
  };
}
```

To use this service, provide it as a `DataLayerService` in AppModule:

```ts
// app.module.ts
@NgModule({
  providers: [{ provide: DataLayerService, useExisting: ObservationLayerService, multi: true }],
})
export class AppModule {}
```

## Provide FHIR Resource Mappers

`FhirConverter` requires a `Mapper` implementation for each type of FHIR Resource.
Charts-on-FHIR comes with a few built-in mappers.
You can implement additional mappers to add support for other types of FHIR Resources or to customize specific data layers.

Add the ones that you want to use to the providers array in AppModule. The order is important here. `FhirConverter` will use the first Mapper that is capable of mapping each resource, so specific mappers should come before generic mappers in this list.

```ts
// app.module.ts
@NgModule({
  providers: [
    { provide: Mapper, useExisting: BloodPressureMapper, multi: true },
    { provide: Mapper, useExisting: ComponentObservationMapper, multi: true },
    { provide: Mapper, useExisting: SimpleObservationMapper, multi: true },
    { provide: Mapper, useExisting: DurationMedicationMapper, multi: true },
    { provide: Mapper, useExisting: SimpleMedicationMapper, multi: true },
  ],
})
export class AppModule {}
```

### API Reference

- `BloodPressureMapper`
- `ComponentObservationMapper`
- `SimpleObservationMapper`
- `DurationMedicationMapper`
- `SimpleMedicationMapper`
