# Showcase Application Instructions

The showcase app is the primary demonstration application for the Charts-on-FHIR library, showing all available features and components.

## Application Structure

### Key Features

- SMART-on-FHIR launch integration
- Patient context management and switching
- Interactive chart dashboard with multiple visualization types
- Real-time data filtering and date range selection
- Responsive design for desktop and mobile devices
- EHR integration testing and development tools

### Development Guidelines

#### SMART-on-FHIR Integration

- Handle both EHR launch and standalone launch modes
- Implement proper OAuth2/OIDC flow for SMART-on-FHIR
- Store and manage FHIR client context across page refreshes
- Handle token refresh and session expiration gracefully

#### Patient Data Management

- Support patient context switching within the same session
- Implement proper data caching and invalidation strategies
- Handle large patient datasets with pagination
- Provide meaningful loading states during data fetching

#### Chart Dashboard

- Use the ngx-charts-on-fhir library components exclusively
- Implement responsive grid layouts for chart arrangements
- Support user customization of dashboard layout
- Provide export functionality for chart data and images

#### Configuration Management

- Support multiple FHIR server configurations (Logica, Epic, Cerner, etc.)
- Handle different FHIR server capabilities and quirks
- Provide development modes with mock data
- Implement feature flags for experimental functionality

## Common Development Tasks

### Adding New Chart Types

1. Import the chart component from ngx-charts-on-fhir library
2. Add chart configuration to the dashboard layout
3. Implement proper data binding and event handling
4. Add chart-specific filtering and customization options
5. Test with various patient datasets

### FHIR Server Integration

- Always test with multiple FHIR server implementations
- Handle server-specific FHIR extensions and variations
- Implement proper error handling for network failures
- Test with both synthetic and real patient data

### Performance Optimization

- Implement lazy loading for chart components
- Use virtual scrolling for large patient lists
- Cache FHIR responses appropriately
- Monitor and optimize bundle sizes

### Testing Approach

- Test SMART-on-FHIR launch scenarios
- Verify chart rendering with various data types
- Test responsive design on different screen sizes
- Validate accessibility compliance for healthcare use
