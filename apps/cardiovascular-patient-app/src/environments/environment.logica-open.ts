import { fhirclient } from 'fhirclient/lib/types';

/**
 * A local test environment that uses Logica Sandbox open FHIR server with a hard-coded patient ID
 */

export const environment = {
  production: false,
  clientState: {
    serverUrl: 'https://api.logicahealth.org/chartsonfhir/open',
    tokenResponse: {
      patient: '31059',
    },
  } as fhirclient.ClientState,
  env: window.env,
};
