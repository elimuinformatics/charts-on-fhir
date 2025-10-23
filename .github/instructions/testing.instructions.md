# Testing and Utilities Instructions

This covers testing patterns and utility projects in the Charts-on-FHIR repository.

## Testing Strategy

### Unit Testing with Karma/Jasmine

- Test all public APIs of chart components
- Mock FHIR data using realistic synthetic patient data
- Test error scenarios and edge cases
- Use Jasmine marbles for testing RxJS streams and observables

### FHIR Data Testing

- Create representative test datasets for different patient scenarios
- Test with malformed or incomplete FHIR resources
- Verify proper handling of different FHIR versions (R4, R5)
- Test timezone and date handling across different locales

### Chart Component Testing

- Test chart rendering with various data sizes
- Verify responsive behavior and resize handling
- Test accessibility features (keyboard navigation, screen readers)
- Validate color schemes and contrast ratios

## Utility Projects

### Synthea Utils (`projects/synthea-utils/`)

- Generates synthetic patient data for testing and development
- Creates realistic FHIR Observation resources for various clinical scenarios
- Supports customizable patient demographics and clinical conditions
- Used for creating test datasets for chart components

#### Development Guidelines

- Keep synthetic data clinically realistic but not identifiable
- Support various observation types (vital signs, lab results, patient-reported data)
- Generate data with realistic temporal patterns
- Include both normal and abnormal value ranges

### Mock FHIR Server (`projects/mock-fhir-server/`)

- Provides offline development capabilities
- Serves synthetic FHIR data for testing chart components
- Simulates realistic FHIR server response patterns
- Supports SMART-on-FHIR authentication flows

#### Development Guidelines

- Implement FHIR R4 specification compliance
- Support pagination and search parameters
- Handle CORS and authentication properly
- Provide realistic response times and error scenarios

## Testing Best Practices

### Component Testing Patterns

```typescript
// Always test with realistic FHIR data
const mockObservations: Observation[] = [
  // Use complete, valid FHIR resources
];

// Test both success and error scenarios
it("should handle missing data gracefully", () => {
  // Test with incomplete or malformed data
});

// Test accessibility
it("should be accessible to screen readers", () => {
  // Test ARIA labels and keyboard navigation
});
```

### Data Generation Patterns

- Use consistent patient demographics across test scenarios
- Generate realistic temporal data patterns
- Include edge cases (missing values, out-of-range data)
- Support different clinical specialties and use cases

### Performance Testing

- Test chart rendering with large datasets (1000+ observations)
- Verify memory usage doesn't grow unbounded
- Test chart updates with rapid data changes
- Validate responsive performance on mobile devices

## Common Testing Tasks

### Adding Test Data

1. Create realistic FHIR resources with proper structure
2. Include various clinical scenarios and edge cases
3. Ensure data is de-identified and suitable for public testing
4. Document the clinical context and expected chart behavior

### Mocking FHIR Responses

- Use complete FHIR Bundle resources for search results
- Include proper FHIR metadata and pagination links
- Simulate network latency and error conditions
- Support different FHIR server capabilities
