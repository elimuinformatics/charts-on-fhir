import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedDataLayerListService {
  showAdvancedOptions$ = new BehaviorSubject<boolean>(true);
}
