import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bundle, MedicationOrder, Observation } from 'fhir/r2';
import { delay, EMPTY, expand, Observable, of, tap } from 'rxjs';

const server = 'https://fhir2-internal.elimuinformatics.com/baseDstu2';
const loganSmith = '78193';
const trentLasher = '117335';
const stanleyGeorge = '115534';
const kautzer186 = '170913';
const patient = kautzer186;

@Injectable({ providedIn: 'root' })
export class FhirDataService {
  constructor(private http: HttpClient) {}

  getObservations() {
    return this.http.get<Bundle<Observation>>(`${server}/Observation?patient=${patient}&_count=100`).pipe(
      expand((result) => this.getNextBundle(result).pipe(delay(100))) // todo: remove this delay
    );
  }


  getMedicationsOrder() {
    return this.http.get<Bundle<MedicationOrder>>(`${server}/MedicationOrder?patient=${patient}&_count=100`).pipe(
      expand((result) => this.getNextBundle(result).pipe(delay(100))) // todo: remove this delay
    );
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
