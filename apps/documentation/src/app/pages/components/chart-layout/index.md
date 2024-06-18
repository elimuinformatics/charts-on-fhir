# {{ NgDocPage.title }}

## Overview

A full-page layout with a toolbar and collapsible panels on the left side of the screen. The `toolbar` input can be used to customize which buttons are available (along with their associated panels). The `active` input changes which panel is currently open.

### Toolbar Buttons

| Name       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `loading`  | Displays a loading/completed icon. There is no associated panel. |
| `patients` | Opens a `*PatientBrowser` panel                                  |
| `browser`  | Opens a `*DataLayerBrowser` panel                                |
| `options`  | Opens a `*DataLayerList` panel                                   |

## Example

{{ NgDocActions.demo("ChartLayoutDemoComponent", {fullscreenRoute: "demo"}) }}

## API Reference

- `FhirChartLayoutComponent`
