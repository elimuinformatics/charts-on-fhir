# {{ NgDocPage.title }}

## Overview

A group of buttons and date selectors for adjusting the zoom range of the chart.

## Example

{{ NgDocActions.demo("TimelineRangeSelectorDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule, TimelineRangeSelectorModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ FhirChartModule, TimelineRangeSelectorModule],
})
export class AppModule {}
```

## API Reference

- `TimelineRangeSelectorComponent`
