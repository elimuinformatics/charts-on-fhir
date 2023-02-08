import { fhirclient } from 'fhirclient/lib/types';

/**
 * A local test environment that uses Mock FHIR server with a hard-coded patient ID
 */
export const environment = {
  production: false,
  clientState: {
    serverUrl: 'http://localhost:3000',
  } as fhirclient.ClientState,
};
