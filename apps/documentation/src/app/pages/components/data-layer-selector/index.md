# {{ NgDocPage.title }}

## Overview

A dropdown menu for switching between pre-defined sets of layers.

## Example

{{ NgDocActions.demo("DataLayerSelectorDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { FhirChartModule, DataLayerSelectorModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ FhirChartModule, DataLayerSelectorModule],
})
export class AppModule {}
```

## API Reference

- `DataLayerSelectorComponent`
