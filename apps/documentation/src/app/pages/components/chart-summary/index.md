# {{ NgDocPage.title }}

## Overview

A stack of summary cards that display information about each data layer on the chart. The summary information will be updated dynamically to reflect the data points that are currently visible on the chart.

## Example

{{ NgDocActions.demo("ChartSummaryDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule, FhirChartSummaryModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [, /* ... */ FhirChartModule, FhirChartSummaryModule],
  providers: [{ provide: SummaryService, useClass: ScatterDataPointSummaryService, multi: true }],
})
export class AppModule {}
```

## Summary Services

This component uses the provided `SummaryService` implementations to generate the content for each summary card. It requires at least one `SummaryService` that is capable of summarizing each layer. If more than one service is capable of a summarizing a layer, it will use the one that comes first in the providers array. Charts-on-FHIR comes with a few built-in summary services. Applications can create additional services to customize the summary information or add support for other types of data.

- `ScatterDataPointSummaryService` computes basic statistics for numerical data
- `HomeMeasurementSummaryService` computes combined statistics for layers with both home and clinic measurements
- `MedicationSummaryService` shows a list of the patient's medications

## API Reference

- `FhirChartSummaryComponent`
