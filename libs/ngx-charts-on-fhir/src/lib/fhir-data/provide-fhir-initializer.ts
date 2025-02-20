import { Provider, inject, provideAppInitializer } from '@angular/core';
import { FhirDataService } from './fhir-data.service';

export function provideFhirInitializer(environment: any): Provider {
  return [
    provideAppInitializer(() => {
      const initializerFn = initializeFhirFactory(environment)(inject(FhirDataService));
      return initializerFn();
    }),
  ];
}

function initializeFhirFactory(environment: any) {
  return (service: FhirDataService) => {
    return () => service.initialize(environment.clientState);
  };
}
