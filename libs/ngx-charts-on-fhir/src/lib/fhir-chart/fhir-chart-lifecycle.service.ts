import { Injectable, OnDestroy } from '@angular/core';
import { Chart, Plugin } from 'chart.js';
import { Subject } from 'rxjs';

/** Registers a chartjs plugin and exposes chart lifecycle events as Observables */
@Injectable({
  providedIn: 'root',
})
export class FhirChartLifecycleService implements OnDestroy {
  constructor() {
    if (Chart.registry.plugins.get(this.plugin.id)) {
      console.warn('lifecycle-service-plugin has already been registered');
    } else {
      Chart.register(this.plugin);
    }
  }

  ngOnDestroy(): void {
    Chart.unregister(this.plugin);
  }

  private plugin: Plugin = {
    id: 'lifecycle-service-plugin',
    afterInit: (...args) => this.afterInit.next(args),
    afterUpdate: (...args) => this.afterUpdate.next(args),
  };

  private afterInit = new Subject<Parameters<NonNullable<Plugin['afterInit']>>>();
  afterInit$ = this.afterInit.asObservable();

  private afterUpdate = new Subject<Parameters<NonNullable<Plugin['afterUpdate']>>>();
  afterUpdate$ = this.afterUpdate.asObservable();
}
