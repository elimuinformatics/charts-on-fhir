import { Injectable } from '@angular/core';
import { DataLayer, DataLayerService } from 'ngx-charts-on-fhir';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExampleDataset extends DataLayerService {
  name = 'Example';
  retrieve = () =>
    of<DataLayer>({
      name: this.name,
      datasets: [
        {
          label: 'Example',
          xAxisID: 'timeline',
          yAxisID: 'example',
          data: [
            { x: 1662036190000, y: 65 },
            { x: 1662208990000, y: 70 },
            { x: 1662708990000, y: 73 },
            { x: 1663026190000, y: 68 },
            { x: 1663159390000, y: 75 },
            { x: 1663245790000, y: 79 },
          ],
        },
      ],
      scales: {
        example: {
          position: 'left',
          type: 'linear',
          stack: 'all',
          stackWeight: 1,
          weight: 2,
          title: {
            display: true,
            text: 'Example',
          },
        },
        timeline: {
          position: 'bottom',
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'd MMM yyyy',
            },
          },
        },
      },
    }).pipe(delay(2000));
}
