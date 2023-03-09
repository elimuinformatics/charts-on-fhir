# {{ NgDocPage.title }}

## Overview

A dynamic chart that displays multiple Data Layers along a single time scale.

## Example

{{ NgDocActions.demo("ChartDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule } from "ngx-charts-on-fhir";

@NgModule({
  imports: [, /* ... */ FhirChartModule],
})
export class AppModule {}
```

## API Reference

- `FhirChartComponent`
