import { Provider, APP_INITIALIZER } from '@angular/core';
import { FhirDataService } from './fhir-data.service';

export function provideFhirInitializer(environment: any): Provider {
  return [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFhirFactory(environment),
      deps: [FhirDataService],
      multi: true,
    },
  ];
}

function initializeFhirFactory(environment: any) {
  return (service: FhirDataService) => {
    return () => service.initialize(environment.clientState);
  };
}
