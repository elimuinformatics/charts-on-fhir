import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFhirInitializer } from '@elimuinformatics/ngx-charts-on-fhir';
import provideChartsOnFhir from './provide-charts-on-fhir';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideFhirInitializer(environment), provideAnimations(), provideChartsOnFhir()],
};
