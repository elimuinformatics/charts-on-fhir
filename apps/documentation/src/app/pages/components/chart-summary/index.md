# {{ NgDocPage.title }}

## Overview

A stack of summary cards that display information about each data layer on the chart. The summary information will be updated dynamically to reflect the data points that are currently visible on the chart. If a summary card gets too small to display all of the content, it can be expanded to full size by clicking on it.

## Inputs

| Name      | Type      | Default | Description                                                                                  |
| --------- | --------- | ------- | -------------------------------------------------------------------------------------------- |
| autoAlign | `boolean` | `false` | If set to `true`, each summary card will be vertically aligned with the corresponding chart. |

When `autoAlign` is set to `true`, the height of each card is determined by the height of the corresponding chart.
This should only be used when the chart and summary components are used in a horizontal layout.
If the chart and summary are arranged vertically, `autoAlign` should be set to false.

## Example

{{ NgDocActions.demo("ChartSummaryDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule, FhirChartSummaryModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ FhirChartModule, FhirChartSummaryModule],
  providers: [provideChartsOnFhir(withSummaryServices(ScatterDataPointSummaryService))],
})
export class AppModule {}
```

## Summary Services

This component uses the provided `SummaryService` implementations to generate the content for each summary card. It requires at least one `SummaryService` that is capable of summarizing each layer. If more than one service is capable of a summarizing a layer, it will use the one that comes first in the providers array. Charts-on-FHIR comes with a few built-in summary services. Applications can create additional services to customize the summary information or add support for other types of data.

- `ScatterDataPointSummaryService` computes basic statistics for numerical data
- `MedicationSummaryService` shows a list of the patient's medications
- `EncounterSummaryService` shows the patient's most recent encounter

## API Reference

- `FhirChartSummaryComponent`
