import { fhirclient } from 'fhirclient/lib/types';

/**
 * A local test environment that uses Mock FHIR server with a hard-coded patient ID
 */
export const environment = {
  production: false,
  clientState: {
    serverUrl: 'http://localhost:3000',
    tokenResponse: {
      patient: '7e4eeb22-3015-7a1f-0a96-a2f3f3f02931',
    },
  } as fhirclient.ClientState,
};
