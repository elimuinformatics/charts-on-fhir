# {{ NgDocPage.title }}

## Overview

A dynamic chart that displays multiple Data Layers along a single time scale.

## Examples

### Basic Chart

{{ NgDocActions.demo("ChartDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ FhirChartModule],
})
export class AppModule {}
```

### Floating Content

Content can be projected into a draggable floating panel on top of the chart. This can be used to display other Charts-on-FHIR components (like a `*ChartLegend`), or any other custom content.

{{ NgDocActions.demo("FloatingContentDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule, FhirChartLegendModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ FhirChartModule, FhirChartLegendModule],
})
export class AppModule {}
```

## API Reference

- `FhirChartComponent`
