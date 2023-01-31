# Charts-on-FHIR

A data visualization library for SMART-on-FHIR apps.
Built with [Chart.js](https://www.chartjs.org/)

## Running the Showcase app

1. Run `npm run watch ngx-charts-on-fhir` to build the library and watch for changes.
2. Run `npm start showcase` to start the local development server for the showcase app.
2. Run `npm start cardiovascular-health` to start the local development server for the cardiovascular-health app.
2. Run `npm start cardiovascular-patient-app` to start the local development server for the cardiovascular-patient-app.
3. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Logica Open FHIR Server

When running in Angular development server, if no EHR launch context is detected then the showcase app will connect to an open FHIR server using the configuration in `environment.logica-open.ts`.

### Mock FHIR Server

A mock FHIR server can also be used for offline development when Logica is unavailable.
1. `npm run mock-fhir-install` (first time only)
2. `npm run mock-fhir`
3. `npm start showcase -- --configuration=mock`

### EHR Launch

To test an EHR launch with the Angular development server, you need an EHR simulator that allows using unsecured HTTP on localhost. The app should be registered with the following configuration:
- Launch URI: `http://localhost:4200/launch.html`
- Redirect URI: `http://localhost:4200`
- Client ID: must match the one in `launch.html`
- Scopes: should match the ones in `launch.html`

## Building the library

Run `ng build ngx-charts-on-fhir` to build the library. The build artifacts will be stored in the `dist/ngx-charts-on-fhir` directory.

## Running unit tests



Run `ng test ngx-charts-on-fhir` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `ng test cardiovascular-patient-app` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running a Docker container

Any of the sample applications in this workspace can be built as a self-contained Docker image that runs NGINX webserver.
This uses a production build configuration suitable for deployment.
The Dockerfile accepts a build-arg for the project name. To build an image for the showcase app:

`docker build --build-arg project=showcase -t showcase .`

The app's SMART clientId must be provided by an environment variable when starting the container.
To run the container on http://localhost:4200:

1. `export CLIENT_ID=client_id_that_is_registered_with_the_ehr`
2. `docker run -p 4200:80 -e CLIENT_ID showcase`
