# Charts-on-FHIR Copilot Instructions

## Project Overview

Charts-on-FHIR is an Angular library for FHIR data visualization in healthcare applications. This is an Nx monorepo with an Angular component library and demo apps.

## Technology Stack

- **Angular 19** with **TypeScript 5.7.3**
- **Chart.js 4.x** with ng2-charts
- **FHIR client 2.5** for SMART-on-FHIR integration
- **Angular Material 19** for UI components
- **Nx 20.4** for build/test

## Repository Structure

- `libs/ngx-charts-on-fhir/`: Core Angular component library
- `apps/showcase/`: Main demo application
- `apps/cardio/`: Cardiology-focused dashboard
- `apps/documentation/`: Documentation site (ng-doc)
- `projects/synthea-utils/`: Synthetic patient data generator
- `projects/mock-fhir-server/`: Mock FHIR server for development

## Key Patterns

### Component Development

- Use Angular standalone components with `imports` array
- Implement proper lifecycle hooks (OnInit, OnDestroy)
- Always destroy Chart.js instances in ngOnDestroy

### FHIR Data

- Use `@types/fhir` for TypeScript types
- Handle missing/invalid FHIR data gracefully
- Use fhirclient for SMART-on-FHIR authentication

### Chart.js Integration

- Register plugins: annotation, zoom, custom scale dividers
- Use Chart.js plugins for annotations and zoom
- Handle chart resize for responsive layouts

## Common Commands

```bash
npm start showcase              # Start showcase app
npm run build ngx-charts-on-fhir   # Build library
npm test ngx-charts-on-fhir     # Run tests
npm run generate-patient        # Generate test data
npm run mock-fhir               # Start mock FHIR server
```
