import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bundle, MedicationRequest, Observation } from 'fhir/r4';
import { delay, EMPTY, expand, Observable, of, tap } from 'rxjs';

const server = 'https://api.logicahealth.org/chartsonfhir/open';
const vonRueden376 = '14635';
const baumbach677 = '15134';
const wolf938 = '20920';
const patient = wolf938;

@Injectable({ providedIn: 'root' })
export class FhirDataService {
  url = `${server}/MedicationRequest?patient=${patient}&_count=100`;
  constructor(private http: HttpClient) {}

  getObservations() {
    return this.http.get<Bundle<Observation>>(`${server}/Observation?patient=${patient}&_count=100`).pipe(expand((result) => this.getNextBundle(result)));
  }

  getMedicationRequests() {
    return this.http.get<Bundle<MedicationRequest>>(this.url).pipe(expand((result) => this.getNextBundle(result)));
  }

  getBloodPressureObservations() {
    return this.http.get<Bundle<Observation>>(`${server}/Observation?patient=${patient}&code=85354-9&_count=3`).pipe(
      expand((result) => this.getNextBundle(result).pipe(delay(100))) // todo: remove this delay and increase the _count param
    );
  }

  private getNextBundle<R>(result: Bundle<R>): Observable<Bundle<R>> {
    const next = result.link?.find((link) => link.relation === 'next');
    if (next?.url) {
      return this.http.get<Bundle<R>>(next.url);
    }
    return EMPTY;
  }
}

function cached<T>(key: string, source: Observable<T>): Observable<T> {
  const cachedJSON = sessionStorage.getItem(key);
  if (cachedJSON) {
    return of(JSON.parse(cachedJSON));
  } else {
    return source.pipe(tap((result) => sessionStorage.setItem(key, JSON.stringify(result))));
  }
}

function mergeBundles<R>(...sources: Bundle<R>[]): Bundle<R> {
  return {
    entry: sources.flatMap((source) => source.entry ?? []),
    resourceType: 'Bundle',
    type: sources[0].type,
  };
}
