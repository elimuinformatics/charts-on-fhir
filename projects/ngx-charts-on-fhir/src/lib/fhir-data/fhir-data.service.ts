import { Injectable } from '@angular/core';
import * as FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';
import { Observable } from 'rxjs';
import { Bundle, FhirResource } from 'fhir/r4';

/**
 * A wrapper service for the SMART-on-FHIR javascript client that makes it easier to use with Angular and RxJS.
 *
 * Applications must call the [initialize] method and wait until the returned promise is resolved before calling other methods of this service.
 * An `APP_INITIALIZER` factory is a good place to call [initialize].
 */
@Injectable({
  providedIn: 'root',
})
export class FhirDataService {
  client?: Client;

  /**
   * Initialize the FHIR Client using OAuth token response from EHR launch, if available.
   * If no EHR launch context is found, it will create a Client from the provided `clientState` parameter.
   */
  async initialize(clientState?: fhirclient.ClientState) {
    console.info('FHIR Client Initializing...');
    if (sessionStorage.getItem('SMART_KEY')) {
      this.client = await FHIR.oauth2.ready();
    } else {
      console.warn('No SMART state found in session storage!');
      if (clientState) {
        console.warn('Loading SMART state from environment configuration. This should not be used in a production EHR environment!');
        this.client = FHIR.client(clientState);
      }
    }
    if (this.client) {
      console.info('FHIR Client Ready', this.client.getState());
    } else {
      console.error('FHIR Client could not be created because no launch context was found.');
    }
  }

  /**
   * Creates an Observable that wraps a call to `Client.patient.request()`.
   *
   * - Subscribing to the Observable will make a request to the FHIR server.
   * - The Observable will emit a Bundle for each page of results retrieved from the server.
   * - The Observable will complete when all pages have been retrieved.
   * - Unsubscribe from the Observable to stop retrieving more pages.
   */
  getPatientData<R extends FhirResource>(url: string): Observable<Bundle<R>> {
    return new Observable((subscriber) => {
      if (!this.client) {
        subscriber.error('FhirClientService has not been initialized.');
        return;
      }
      let cancel = false;
      const teardownLogic = () => (cancel = true);
      const onPage = (data: any) => {
        subscriber.next(data);
        if (cancel) {
          // if onPage throws an error, the client will not continue fetching more pages
          throw new Error('Cancelled by subscriber');
        }
      };
      // use maximum page size on every request to improve performance
      url = addCountParam(url);
      this.client.patient
        .request(url, { pageLimit: 0, onPage })
        .then(() => subscriber.complete())
        .catch((error) => subscriber.error(error));
      return teardownLogic;
    });
  }
}

function addCountParam(url: string) {
  if (!url.includes('_count=')) {
    if (url.includes('?')) {
      url += '&';
    } else {
      url += '?';
    }
    url += '_count=200';
  }
  return url;
}
