# Synthea Utilities

This project contains some modules and utility scripts for creating patient-generated data with Synthea.

## Quick Start

1. Download the Synthea JAR: https://github.com/synthetichealth/synthea/wiki/Basic-Setup-and-Running
1. Run `npm start`
1. Find the post-processed patient bundle in `../mock-fhir-server/data/` folder

Sometimes Synthea will fail to generate a patient that meets the criteria in the keep module. If this happens, just try again.

## Use the Patient with Mock FHIR Server

The script will automatically add the patient to the Mock FHIR Server.
If you are running the Showcase app with `--configuration=mock` just reload the page and select the new patient.

## Use the Patient with a real FHIR Server

1. Import the bundle `output/fhir/hospitalInformation*.json`
1. Import the bundle `output/fhir/practitionerInformation*.json`
1. Import the post-processed patient bundle from `../mock-fhir-server/data/` folder

The unprocessed patient bundle can be found in `output/fhir`
