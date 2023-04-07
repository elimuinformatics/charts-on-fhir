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

## Manage Data Layers

All of the Charts-on-FHIR components rely on `DataLayerManagerService`, which is responsible for retrieving, selecting, and modifying `DataLayer` objects. This service is provided in the root injector, so all components share a single instance of the service and your application can inject this same instance to access and modify the layers. To retrieve all data layers when the application starts, your main AppComponent should call the `retrieveAll()` method from `ngOnInit`.

```ts
// app.component.ts
import { Component, OnInit } from "@angular/core";
import { DataLayerManagerService } from "@elimuinformatics/ngx-charts-on-fhir";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll();
  }
}
```

### Automatically Selecting All Layers

If you want to add all layers to the chart as they are retrieved, you can pass in `true` for the first parameter to `retrieveAll()`. Before doing this, make sure that your `DataLayerService` implementations are querying a limited set of data from the FHIR server. You can also pass a sort comparison function as the second parameter to `retrieveAll()` to customize the initial sort order of the layers.

```ts
// app.component.ts
import { Component, OnInit } from "@angular/core";
import { DataLayerManagerService } from "@elimuinformatics/ngx-charts-on-fhir";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(private layerManager: DataLayerManagerService) {}
  ngOnInit(): void {
    this.layerManager.retrieveAll(true, this.sortCompareFn);
  }
  sortCompareFn = (a: DataLayer, b: DataLayer) => {
    const layerOrder: string[] = ["Heart rate", "Blood Pressure", "Medications"];
    return layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name);
  };
}
```

### API Reference

- `DataLayerManagerService`

## Next Steps

Now you are ready to select some components and build an application. See the _Components_ list at left for usage examples of each component.
