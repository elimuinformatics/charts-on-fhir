# {{ NgDocPage.title }}

## Overview

A list of all data layers that have been added to the chart. The layers can be re-ordered by dragging, and toggled on/off by clicking the checkboxes. Expanding a layer's accordion panel reveals a list of datasets and annotations included in that layer, and allows you to change some basic dataset options.

## Example

{{ NgDocActions.demo("DataLayerListDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { DataLayerListModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [/* ... */ DataLayerListModule],
})
export class AppModule {}
```

## API Reference

- `DataLayerListComponent`
