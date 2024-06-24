# {{ NgDocPage.title }}

## Overview

A Legend for the chart. There are two alternatives: A full legend that shows every dataset, and a simplified legend that only shows the dataset tags.

## Examples

### Dataset Legend

Displays the color and symbol for each dataset on the chart.

{{ NgDocActions.demo("ChartLegendDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

### Tags Legend

Displays the symbol for each tag. Tags are used to apply the same style to multiple datasets.

{{ NgDocActions.demo("ChartTagsLegendDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

## Configuring Tags

The built-in Observation mappers (`SimpleObservationMapper` and `ComponentObservationMapper`) add "Home" and "Clinic" tags.
`FhirChartTagsService` provides basic default styles for these tags and exposes a `setTagStyles()` method that can be used to customize tag styles.

```ts
export class AppComponent implements OnInit {
  constructor(private tagsService: FhirChartTagsService) {}
  ngOnInit(): void {
    this.tagsService.setTagStyles({
      Home: {
        pointStyle: "triangle",
      },
      Clinic: {
        pointStyle: "rect",
      },
    });
  }
}
```

Custom tags can be added to a dataset by setting the `chartsOnFhir.tags` property when mapping the `DataLayer`.

```ts
@Injectable({ providedIn: "root" })
export class ExampleMapper implements Mapper<Resource> {
  map(resource: Resource): DataLayer {
    return {
      name: "Example Layer",
      datasets: [
        {
          label: "Example Dataset",
          chartsOnFhir: {
            tags: ["MyTag"],
          },
        },
      ],
    };
  }
}
```

## API Reference

- `FhirChartLegendComponent`
- `FhirChartTagsLegendComponent`
- `FhirChartTagsService`
