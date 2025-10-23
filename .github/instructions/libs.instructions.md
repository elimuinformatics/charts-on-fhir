# ngx-charts-on-fhir Library Instructions

This directory contains the core Angular component library.

## Library Structure

### Core Components

- `fhir-chart/`: Main chart component using Chart.js
- `fhir-chart-layout/`: Layout wrapper for charts
- `fhir-chart-legend/`: Custom legend for FHIR data
- `data-layer/`: Core data layer abstraction
- `data-layer-selector/`: Multi-select for data layers
- `summary-range-selector/`: Date range picker
- `patient-browser/`: Patient selection component

### Services

- `fhir-data/`: FHIR resource fetching and processing
- `fhir-mappers/`: Transform FHIR Observations to chart data
- `color-picker/`: Color palette management

## Development Patterns

### Component Design

- Use Angular standalone components with `imports` array
- Implement OnInit, OnDestroy lifecycle hooks
- Always destroy Chart.js instances in ngOnDestroy

### FHIR Integration

- Use `@types/fhir` for TypeScript types
- Handle missing/malformed FHIR data gracefully
- Validate FHIR resource structure before processing

### Chart.js Usage

- Register required plugins: annotation, zoom, scaleStackDivider
- Use Chart.js plugins for custom interactions
- Handle chart resize for responsive layouts

## Adding New Components

1. Create component in appropriate subdirectory
2. Use standalone component pattern with imports array
3. Add FHIR data mapper if needed
4. Write unit tests
5. Export from `index.ts`
