# {{ NgDocPage.title }}

## Overview

A list of all data layers that have been retrieved and are available to add to the chart. The list can be sorted and filtered to quickly find the layer you are looking for. Layers that have already been added to the chart will not show up in the list.

## Example

{{ NgDocActions.demo("DataLayerBrowserDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

```ts
// app.module.ts
import { DataLayerBrowserModule } from "@elimuinformatics/ngx-charts-on-fhir";

@NgModule({
  imports: [, /* ... */ DataLayerBrowserModule],
})
export class AppModule {}
```

## API Reference

- `DataLayerBrowserComponent`
