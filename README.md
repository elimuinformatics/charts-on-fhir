# Charts-on-FHIR

A data visualization library for SMART-on-FHIR healthcare applications.

## Building your own app

Explore the [Documentation](https://elimuinformatics.github.io/charts-on-fhir) for
[Getting Started](https://elimuinformatics.github.io/charts-on-fhir/getting-started/installation) guides,
[API docs](https://elimuinformatics.github.io/charts-on-fhir/api), and
[examples](https://elimuinformatics.github.io/charts-on-fhir/components/chart).

## Projects in this repository

### Library

- [ngx-charts-on-fhir](libs/ngx-charts-on-fhir): An Angular component library that you can use to build applications

### Applications

- [showcase](apps/showcase): A customizable clinical dashboard that demonstrates all of the library's features
- [cardio](apps/cardio): A pre-configured clinical dashboard focused on patient-generated health data (PGHD)
- [cardio-patient](apps/cardio-patient): A patient-facing application for submitting blood pressure measurements and viewing prior data
- [documentation](apps/documentation): The application that powers the library's [Documentation site](https://elimuinformatics.github.io/charts-on-fhir)

### Utilities

- [synthea-utils](projects/synthea-utils): Modules and utility scripts for creating patient-generated data with [Synthea](https://github.com/synthetichealth/synthea)
- [mock-fhir-server](projects/mock-fhir-server/): A simple mock server to aid in development on the showcase app

## Running the Applications

1. Run `npm start <project>` to start the local development server. For example: `npm start showcase` will start the showcase app.
2. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Logica Open FHIR Server

When running in Angular development server, if no EHR launch context is detected then the showcase app will connect to an open FHIR server using the configuration in `environment.logica-open.ts`.

### Mock FHIR Server

A mock FHIR server can also be used for offline development when Logica is unavailable. This server only works with the showcase app.

1. `npm run generate-patient` (at least once)
2. `npm run mock-fhir-install` (first time only)
3. `npm run mock-fhir`
4. `npm start showcase -- --configuration=mock`

### EHR Launch

To test an EHR launch with the Angular development server, you need an EHR simulator that allows using unsecured HTTP on localhost. The app should be registered with the following configuration:

- Launch URI: `http://localhost:4200/launch.html`
- Redirect URI: `http://localhost:4200`
- Client ID: must match the one in `launch.html`
- Scopes: should match the ones in `launch.html`

## Building the library

Run `npm run build ngx-charts-on-fhir` to build the library. The build artifacts will be stored in the `dist/libs/ngx-charts-on-fhir` directory.

## Running unit tests

Run `npm test <project>` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running a Docker container

Any of the sample applications in this workspace can be built as a self-contained Docker image that runs NGINX webserver.
This uses a production build configuration suitable for deployment.
The Dockerfile accepts a build-arg for the app name. To build an image for the showcase app:

`docker build --build-arg app=showcase -t showcase .`

The app's SMART clientId must be provided by an environment variable when starting the container.
To run the container on http://localhost:4200:

1. `export CLIENT_ID=client_id_that_is_registered_with_the_ehr`
2. `docker run -p 4200:80 -e CLIENT_ID showcase`
