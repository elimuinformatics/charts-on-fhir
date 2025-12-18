# Testing and Utilities Instructions

## Testing Strategy

### Unit Testing

- Use Karma + Jasmine for component tests
- Mock FHIR data using synthetic patient data
- Test error scenarios and edge cases
- Use jasmine-marbles for RxJS testing (see fhir-data.service.spec.ts)

### Test Data

- Use `projects/synthea-utils/` for generating synthetic FHIR data
- Create realistic test datasets for different patient scenarios
- Test with malformed/incomplete FHIR resources

## Utility Projects

### Synthea Utils (`projects/synthea-utils/`)

- Generates synthetic patient data for development/testing
- Creates FHIR Observation resources for various clinical scenarios
- Run with `npm run generate-patient`

### Mock FHIR Server (`projects/mock-fhir-server/`)

- Provides offline development capabilities
- Serves synthetic FHIR data for testing
- Start with `npm run mock-fhir`
- Use showcase app with `--configuration=mock`
