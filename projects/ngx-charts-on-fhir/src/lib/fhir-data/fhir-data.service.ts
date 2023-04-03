import { Injectable } from '@angular/core';
import FHIR from 'fhirclient';
import { Observable } from 'rxjs';
import { Bundle, FhirResource } from 'fhir/r4';
import { retryBackoff } from 'backoff-rxjs';
import { errorStatusCheck} from '../utils';

export interface BloodPressure {
  systolic?: number | null;
  diastolic?: number | null;
}

type Client = ReturnType<typeof FHIR.client>;
type ClientState = Client['state'];
type Resource = Parameters<Client['create']>[0];

/**
 * A wrapper service for the SMART-on-FHIR javascript client that makes it easier to use with Angular and RxJS.
 *
 * Applications must call the `initialize` method and wait until the returned promise is resolved before calling other methods of this service.
 * An `APP_INITIALIZER` factory is a good place to call `initialize`.
 */
@Injectable({
  providedIn: 'root',
})
export class FhirDataService {
  client?: Client;
  private clientState?: ClientState;
  private MAX_RETRIES: number = 3;
  private INITIAL_INTERVAL: number = 100;

  get isSmartLaunch(): boolean {
    return !!sessionStorage.getItem('SMART_KEY');
  }

  /**
   * Initialize the FHIR Client using OAuth token response from EHR launch, if available.
   * If no EHR launch context is found, it will create a Client from the provided `clientState` parameter.
   */
  async initialize(clientState?: ClientState) {
    console.info('FHIR Client Initializing...');
    if (this.isSmartLaunch) {
      this.client = await FHIR.oauth2.ready();
    } else {
      console.warn('No SMART state found in session storage!');
      if (clientState) {
        console.warn('Loading SMART state from environment configuration. This should not be used in a production EHR environment!');
        this.client = FHIR.client(clientState);
        this.clientState = clientState;
      }
    }
    if (this.client) {
      console.info('FHIR Client Ready', this.client.getState());
    } else {
      console.error('FHIR Client could not be created because no launch context was found.');
    }
  }

  /* Creates a new launch context with a different patient. This only works with open FHIR servers. */
  changePatient(patientId: string) {
    if (this.isSmartLaunch) {
      console.error('Patient cannot be changed for a SMART-on-FHIR launch.');
      return;
    }
    if (!this.clientState) {
      console.error('FHIR Client could not be created because no launch context was found.');
      return;
    }
    if (!this.clientState.tokenResponse) {
      this.clientState.tokenResponse = {};
    }
    this.clientState.tokenResponse.patient = patientId;
    this.client = FHIR.client(this.clientState);
  }

  /**
   * Creates an Observable that wraps a call to `Client.patient.request()`.
   *
   * - Subscribing to the Observable will make a request to the FHIR server.
   * - The Observable will emit a Bundle for each page of results retrieved from the server.
   * - The Observable will complete when all pages have been retrieved.
   * - Unsubscribe from the Observable to stop retrieving more pages.
   */
  getPatientData<R extends FhirResource>(url: string, currentPatientOnly = true): Observable<Bundle<R>> {
    return new Observable<Bundle<R>>((subscriber) => {
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
      const request = currentPatientOnly ? this.client.patient.request.bind(this.client.patient) : this.client.request.bind(this.client);

      request(url, { pageLimit: 0, onPage })
        .then(() => subscriber.complete())
        .catch((error) => subscriber.error(error));
      return teardownLogic;
    }).pipe(
      retryBackoff({
        initialInterval: this.INITIAL_INTERVAL,
        maxRetries: this.MAX_RETRIES,
        resetOnSuccess: true,
        shouldRetry: (error) => {
          return errorStatusCheck(error);
        },
      })
    );
  }


  addPatientData<R extends Resource>(resource: R): Observable<R> {
    return new Observable<R>((subscriber) => {
      if (!this.client) {
        subscriber.error('FhirClientService has not been initialized.');
        return;
      }
      this.client
        .create<R>(resource)
        .then((res) => {
          subscriber.next(res);
          subscriber.complete();
        })
        .catch((error) => subscriber.error(error));
    }).pipe(
      retryBackoff({
        initialInterval: this.INITIAL_INTERVAL,
        maxRetries: this.MAX_RETRIES,
        resetOnSuccess: true,
        shouldRetry: (error) => {
          return errorStatusCheck(error);
        },
      })
    );
  }

  createBloodPressureResource(reportBPValue: BloodPressure): Resource {
    return {
      resourceType: 'Observation',
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'vital-signs',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '85354-9',
            display: 'Blood Pressure',
          },
        ],
        text: 'Blood Pressure',
      },
      extension: [
        {
          url: 'http://hl7.org/fhir/us/vitals/StructureDefinition/MeasurementSettingExt',
          valueCodeableConcept: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '264362003',
                display: 'Home (environment)',
              },
            ],
          },
        },
      ],
      subject: {
        reference: `Patient/${this.client?.patient.id}`,
      },
      effectiveDateTime: new Date().toISOString(),
      issued: new Date().toISOString(),
      component: [
        {
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '8462-4',
                display: 'Diastolic Blood Pressure',
              },
            ],
            text: 'Diastolic Blood Pressure',
          },
          valueQuantity: {
            value: Number(reportBPValue.diastolic),
            unit: 'mm[Hg]',
            system: 'http://unitsofmeasure.org',
            code: 'mm[Hg]',
          },
        },
        {
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '8480-6',
                display: 'Systolic Blood Pressure',
              },
            ],
            text: 'Systolic Blood Pressure',
          },
          valueQuantity: {
            value: Number(reportBPValue.systolic),
            unit: 'mm[Hg]',
            system: 'http://unitsofmeasure.org',
            code: 'mm[Hg]',
          },
        },
      ],
    };
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
