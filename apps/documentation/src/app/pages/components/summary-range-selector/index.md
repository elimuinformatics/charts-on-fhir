# {{ NgDocPage.title }}

## Overview

A group of buttons for changing the timeframe used for statistical calculations in the summary cards, along with the corresponding vertical line annotations on the chart.

## Example

{{ NgDocActions.demo("SummaryRangeSelectorDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import {
  FhirChartModule,
  FhirChartSummaryModule,
  SummaryRangeSelectorModule,
} from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ FhirChartModule, FhirChartSummaryModule, SummaryRangeSelectorModule],
})
export class AppModule {}
```

## API Reference

- `SummaryRangeSelectorComponent`
