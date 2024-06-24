# {{ NgDocPage.title }}

## Overview

A list of all patients that are available on the FHIR server. This can be used during development when testing your app with an open FHIR server, or to quickly review a batch of Synthea-generated patients when using the mock FHIR server. It is not intended for use in production because a real EHR will specify the patient in the SMART launch context.

## Example

{{ NgDocActions.demo("PatientBrowserDemoComponent", { expanded: true, defaultTab: "HTML" }) }}

## API Reference

- `PatientBrowserComponent`
