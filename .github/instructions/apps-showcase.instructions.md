# Showcase Application Instructions

The showcase app demonstrates the Charts-on-FHIR library features.

## Key Features

- SMART-on-FHIR launch integration
- Patient context management
- Interactive chart dashboard
- Real-time data filtering
- Multiple FHIR server configurations

## Development Patterns

### FHIR Integration

- Handle both EHR launch and standalone modes
- Use fhirclient for SMART-on-FHIR OAuth flows
- Support multiple FHIR servers (Logica, Epic, Cerner)
- Implement proper error handling for network failures

### Chart Dashboard

- Use ngx-charts-on-fhir library components
- Implement responsive layouts
- Support patient data caching

## Configuration

- Environment files for different FHIR servers
- Mock data support for offline development
- Development mode with synthetic data
