import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataLayerListService {
  subject$ = new BehaviorSubject<boolean>(false);

  setOptionPanelValue(optionPanelValue: boolean) {
    this.subject$.next(optionPanelValue);
  }
  getOptionPanelValue(): boolean {
    return this.subject$.value;
  }
}
