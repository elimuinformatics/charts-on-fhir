import { Injectable } from '@angular/core';
import { Chart, Plugin } from 'chart.js';
import { Subject } from 'rxjs';

/** Registers a chartjs plugin and exposes chart lifecycle events as Observables */
@Injectable({
  providedIn: 'root',
})
export class FhirChartLifecycleService {
  constructor() {
    console.log('Registering reactive-chart-plugin');
    Chart.register(this.plugin);
  }

  private plugin: Plugin = {
    id: 'reactive-chart-plugin',
    afterInit: (...args) => this.afterInit.next(args),
    afterUpdate: (...args) => this.afterUpdate.next(args),
  };

  private afterInit = new Subject<Parameters<NonNullable<Plugin['afterInit']>>>();
  afterInit$ = this.afterInit.asObservable();

  private afterUpdate = new Subject<Parameters<NonNullable<Plugin['afterUpdate']>>>();
  afterUpdate$ = this.afterUpdate.asObservable();
}
