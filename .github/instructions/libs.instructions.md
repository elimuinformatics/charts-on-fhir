# ngx-charts-on-fhir Library Instructions

This directory contains the core Angular component library for Charts-on-FHIR.

## Library Structure

### Core Components

- `fhir-chart/`: Main chart component that renders Chart.js visualizations
- `fhir-chart-layout/`: Layout wrapper for responsive chart containers
- `fhir-chart-legend/`: Custom legend implementation for FHIR data
- `fhir-chart-summary/`: Summary statistics display component
- `data-layer/`: Core data layer abstraction for FHIR resources
- `data-layer-browser/`: UI for browsing available data layers
- `data-layer-selector/`: Multi-select component for data layers
- `summary-range-selector/`: Date range picker for chart data
- `timeline-range-selector/`: Timeline-based range selection

### Data Processing

- `fhir-data/`: Services for fetching and processing FHIR resources
- `fhir-mappers/`: Transform FHIR Observations into chart datasets
- `patient-browser/`: Patient selection and context management

### Utilities

- `utils.ts`: Common utility functions for date handling, data transformation
- `color-picker/`: Color palette management for chart datasets

## Development Guidelines

### Component Design

- All chart components should extend base Chart.js chart types
- Implement proper Angular lifecycle hooks (OnInit, OnDestroy, OnChanges)
- Use OnPush change detection strategy for performance
- Support both imperative and reactive data binding patterns

### FHIR Data Integration

- Use proper TypeScript types from `@types/fhir`
- Handle missing or malformed FHIR data gracefully
- Implement proper date/time parsing for FHIR DateTime fields
- Support multiple FHIR versions where possible (R4, R5)

### Chart.js Integration

- Always destroy Chart.js instances in ngOnDestroy
- Use Chart.js plugins for annotations, zoom, and custom interactions
- Implement proper resize handling for responsive layouts
- Follow accessibility guidelines for colors and screen readers

### Testing Patterns

- Mock FHIR data using realistic synthetic patient data
- Test both successful data loading and error scenarios
- Use Angular testing utilities for component testing
- Test chart interactions and user events

### API Design

- Follow Angular component API conventions
- Use Input/Output decorators for component interfaces
- Implement proper change detection for complex objects
- Provide both template-driven and reactive forms support

## Common Tasks

### Adding New Chart Types

1. Create component in appropriate subdirectory
2. Extend base chart component with Chart.js configuration
3. Implement FHIR data mapper for the specific resource type
4. Add proper TypeScript interfaces for component inputs
5. Write comprehensive unit tests
6. Update library exports in `index.ts`

### FHIR Resource Mappers

- Always validate resource structure before processing
- Handle missing required fields with sensible defaults
- Implement proper unit conversion for numeric values
- Use consistent date formatting across all mappers

### Performance Considerations

- Use OnPush change detection for all chart components
- Implement virtual scrolling for large datasets
- Debounce chart updates during rapid data changes
- Cache processed chart datasets when appropriate
