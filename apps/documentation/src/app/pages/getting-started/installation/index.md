Before installing Charts-on-FHIR, you will need to create an Angular project.

## Install Angular

If you are new to Angular, see Angular's [Getting Started Guide](https://angular.io/start).

To setup your local Angular environment and create a new project, follow Angular's guide to [Setting up the local environment and workspace](https://angular.io/guide/setup-local).

## Install Charts-on-FHIR

Open a terminal window in your project directory and run the following command:

```console
npm i @elimuinformatics/ngx-charts-on-fhir
```

Enable `esModuleInterop` compiler option in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

Add the default Angular Material theme to your `angular.json` file:

```json
/* angular.json */
{
  "projects": {
    "my-project": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@elimuinformatics/ngx-charts-on-fhir/themes/default.scss", // <- add this line
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

Apply Angular Material's global typography styles by adding the `mat-typography` class to the `body` element in `index.html`. This is optional, but it will make fonts more consistent throughout the app:

```html
<!-- index.html -->
<body class="mat-typography">
  <app-root></app-root>
</body>
```

## Configure Service Providers

Charts-on-FHIR is a modular library that uses Angular's Dependency Injection system to configure which features will be included.

The recommended way to configure service providers is by using the `provideChartsOnFhir` function in either your `app.module.ts` (for NgModule-based apps) or in `app.config.ts` (for standalone component apps). It can also be used in the providers array for a specific route or component, to make Charts-on-FHIR available only to that part of the app.

```ts
providers: [
  provideChartsOnFhir(
    withColors("#e36667", "#377eb8", "#4daf4a"),
    withDataLayerServices(MedicationLayerService, ObservationLayerService),
    withMappers(SimpleMedicationMapper, SimpleObservationMapper),
    withSummaryServices(MedicationSummaryService, ScatterDataPointSummaryService)
  ),
];
```

At a minimum, each app must provide:

1. A color palette
1. At least one `DataLayerService` (See `*RetrievingData` for details)
1. If your `DataLayerService` uses `FhirConverter` then you need to provide at least one `Mapper` that will be used to convert the FHIR Resources into Data Layers. (See `*RetrievingData` for details)
1. If your app uses `FhirChartSummaryComponent` then you need to provide at least one `SummaryService` that will be used to summarize the Data Layers. (See `*ChartSummary` for details)
