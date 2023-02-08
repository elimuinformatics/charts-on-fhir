import { fhirclient } from 'fhirclient/lib/types';

/**
 * A local test environment that uses Mock FHIR server with a hard-coded patient ID
 */
export const environment = {
  production: false,
  clientState: {
    serverUrl: 'http://localhost:3000',
    tokenResponse: {
      patient: 'ade88beb-eaa9-ffcd-afea-8cb6f47c49ac',
    },
  } as fhirclient.ClientState,
};
