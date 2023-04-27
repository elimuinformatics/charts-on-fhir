import { Chart } from 'chart.js';
import { FhirChartLifecycleService } from './fhir-chart-lifecycle.service';
import { firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';

describe('FhirChartLifecycleService', () => {
  let wrapper: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let service: FhirChartLifecycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FhirChartLifecycleService);
    // These tests create a real chart so they can make sure the service's plugin is
    // properly registered with Chart.js and listening to the correct callbacks.
    wrapper = document.createElement('div');
    canvas = document.createElement('canvas', {});
    canvas.width = 100;
    canvas.height = 100;
    wrapper.appendChild(canvas);
    document.body.appendChild(wrapper);
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
  });

  it('afterInit$ should emit after a chart is initialized', async () => {
    // using setTimeout so the chart will be created after we've subscribed to the observable
    let chart: Chart;
    setTimeout(() => {
      chart = new Chart(canvas, {
        data: {
          datasets: [],
        },
      });
    });
    const args = await firstValueFrom(service.afterInit$);
    expect(args[0]).toBe(chart!);
  });

  it('afterUpdate$ should emit after a chart is updated', async () => {
    const chart = new Chart(canvas, {
      data: {
        datasets: [],
      },
    });
    // using setTimeout so the chart update will happen after we've subscribed to the observable
    setTimeout(() => chart.update());
    const args = await firstValueFrom(service.afterUpdate$);
    expect(args[0]).toBe(chart);
  });
});
