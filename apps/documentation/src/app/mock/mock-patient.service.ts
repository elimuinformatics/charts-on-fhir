import { Injectable } from '@angular/core';
import { ReplaySubject, of } from 'rxjs';

@Injectable()
export class MockPatientService {
  isSinglePatientContext = false;
  patients$ = of([
    { id: '000001', name: 'Emma Emmerson' },
    { id: '000002', name: 'John Johnson' },
    { id: '000003', name: 'Lucy Lucky' },
  ]);
  selectedPatientSubject = new ReplaySubject<string>();
  selectedPatient$ = this.selectedPatientSubject.asObservable();

  selectPatient(patientId: string) {
    this.selectedPatientSubject.next(patientId);
  }
}
