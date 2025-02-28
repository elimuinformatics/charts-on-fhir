import { Provider, inject, provideAppInitializer } from '@angular/core';
import { FhirDataService } from './fhir-data.service';

export function provideFhirInitializer(environment: any): Provider {
  return [provideAppInitializer(() => inject(FhirDataService).initialize(environment.clientState))];
}

function initializeFhirFactory(environment: any) {
  return (service: FhirDataService) => {
    return () => service.initialize(environment.clientState);
  };
}
