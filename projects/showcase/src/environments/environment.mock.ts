import { fhirclient } from 'fhirclient/lib/types';

/**
 * A local test environment that uses Mock FHIR server with a hard-coded patient ID
 */
export const environment = {
  production: false,
  clientState: {
    serverUrl: 'http://localhost:3000',
    tokenResponse: {
      patient: '7a67fbaa-1613-6825-e278-b755fc7a2192',
    },
  } as fhirclient.ClientState,
};
