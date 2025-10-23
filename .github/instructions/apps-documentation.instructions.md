# Documentation Application Instructions

The documentation app uses ng-doc to generate comprehensive documentation for the Charts-on-FHIR library.

## Documentation Structure

### Content Types

- **API Documentation**: Auto-generated from TypeScript interfaces and JSDoc comments
- **Component Examples**: Live, interactive examples of each chart component
- **Getting Started Guides**: Step-by-step tutorials for library integration
- **FHIR Integration Guides**: Healthcare-specific implementation patterns

### Development Guidelines

#### Documentation Content

- Write clear, healthcare-focused examples and use cases
- Include code samples that demonstrate real-world FHIR scenarios
- Provide both basic and advanced usage patterns
- Keep examples up-to-date with the latest library version

#### ng-doc Integration

- Use ng-doc decorators and conventions for API documentation
- Organize content hierarchically for easy navigation
- Include live code examples that can be copied and used
- Ensure all public APIs have comprehensive JSDoc comments

#### Healthcare Context

- Frame examples in clinical workflow contexts
- Use realistic patient data scenarios (de-identified)
- Explain FHIR resource relationships and clinical significance
- Address privacy and security considerations

#### Interactive Examples

- Create runnable examples for each chart component
- Show various data scenarios (normal, edge cases, error states)
- Demonstrate responsive behavior and accessibility features
- Include configuration options and customization examples

## Content Guidelines

### Code Examples

- Always use TypeScript with proper typing
- Show both template-driven and reactive approaches
- Include error handling and loading states
- Demonstrate accessibility best practices

### Clinical Context

- Explain the clinical significance of visualized data
- Use appropriate medical terminology with explanations
- Show how charts support clinical decision-making
- Address healthcare regulatory considerations

### API Documentation

- Document all public interfaces with JSDoc
- Include parameter validation and error conditions
- Provide migration guides for breaking changes
- Show integration patterns with popular Angular libraries

## Common Tasks

### Adding Component Documentation

1. Create markdown files with ng-doc frontmatter
2. Include live code examples with realistic FHIR data
3. Document all input/output properties and methods
4. Add accessibility and mobile responsiveness notes
5. Test examples with screen readers and mobile devices

### Updating Guides

- Keep installation and setup instructions current
- Update FHIR server configuration examples
- Verify all code examples compile and run correctly
- Update screenshots and visual examples as needed
