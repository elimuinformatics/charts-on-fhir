# Synthea Utilities

This project contains some modules and utility scripts for creating patient-generated data with Synthea.

## Quick Start

1. Download the Synthea JAR: https://github.com/synthetichealth/synthea/wiki/Basic-Setup-and-Running
1. Run `npm start`
1. Find patient bundle in `output/post-processed/` folder

Sometimes Synthea will fail to generate a patient that meets the criteria in the keep module. If this happens, just try again.

## Use the Patient with Mock FHIR Server

1. Copy the patient bundle to `../mock-fhir-server/data/` folder
1. Change the patient ID in `../showcase/src/environments/environment.mock.ts`
1. Restart the Mock FHIR Server
1. Run the showcase app with `mock` configuration

## Use the Patient with a real FHIR Server

1. Import the bundle `output/fhir/hospitalInformation*.json`
1. Import the bundle `output/fhir/practitionerInformation*.json`
1. Import the patient bundle from `output/post-processed/` folder
