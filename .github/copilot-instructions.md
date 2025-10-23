# Charts-on-FHIR Copilot Instructions

## Project Overview

Charts-on-FHIR is a TypeScript/Angular library for building data visualization dashboards in SMART-on-FHIR healthcare applications. This is an Nx monorepo containing an Angular component library and several sample applications.

## Technology Stack

- **Framework**: Angular 19 with TypeScript 5.7
- **Build System**: Nx 20.4
- **Testing**: Karma + Jasmine
- **Charts**: Chart.js 4.x with ng2-charts
- **FHIR Integration**: fhirclient 2.5
- **UI Components**: Angular Material 19
- **Package Manager**: npm

## Architecture

### Monorepo Structure

- `libs/ngx-charts-on-fhir/`: Core Angular component library
- `apps/showcase/`: Feature-complete clinical dashboard demo
- `apps/cardio/`: Cardiology-focused patient dashboard
- `apps/cardio-patient/`: Patient-facing application
- `apps/documentation/`: Documentation site using ng-doc
- `projects/synthea-utils/`: Synthetic patient data generation tools
- `projects/mock-fhir-server/`: Development FHIR server

### Key Components

- Chart components for FHIR Observation data
- SMART-on-FHIR launch context handling
- Patient data filtering and time range selection
- Responsive chart layouts with Material Design

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow Angular style guide conventions
- Use reactive programming with RxJS
- Implement OnPush change detection strategy for performance
- Use Angular Material design patterns

### FHIR Data Handling

- Always use proper FHIR resource typing from `@types/fhir`
- Handle missing or invalid FHIR data gracefully
- Implement proper date parsing for FHIR DateTime values
- Use fhirclient for SMART-on-FHIR authentication flows

### Chart Implementation

- Extend Chart.js base charts for FHIR-specific visualizations
- Use Chart.js plugins for annotations and zoom functionality
- Implement responsive design with proper chart resizing
- Follow accessibility guidelines for chart colors and labels

### Testing

- Write unit tests for all public APIs
- Mock FHIR data using realistic synthetic data
- Test both successful and error scenarios
- Use Jasmine marbles for testing RxJS streams

## Common Commands

```bash
# Start development server for specific app
npm start showcase
npm start cardio
npm start documentation

# Build the library
npm run build ngx-charts-on-fhir

# Run tests
npm test ngx-charts-on-fhir
npm test showcase

# Generate synthetic patient data
npm run generate-patient

# Start mock FHIR server for offline development
npm run mock-fhir-install  # first time only
npm run mock-fhir
npm start showcase -- --configuration=mock
```

## Important Patterns

### FHIR Resource Processing

- Always validate FHIR resources before processing
- Use type guards for FHIR resource properties
- Handle timezone conversions properly for dates
- Implement proper error boundaries for data loading

### Angular Component Development

- Use OnPush change detection for chart components
- Implement proper lifecycle management for Chart.js instances
- Use trackBy functions for ngFor with large datasets
- Follow Angular accessibility guidelines

### State Management

- Use services for shared state between components
- Implement proper cleanup in component destruction
- Use RxJS operators for data transformation
- Handle loading and error states consistently

## SMART-on-FHIR Context

This library is designed for healthcare applications that:

- Launch from EHR systems using SMART-on-FHIR
- Display patient clinical data from FHIR servers
- Support both provider and patient-facing interfaces
- Handle sensitive healthcare data securely

Always consider privacy, security, and clinical workflow requirements when making changes.
