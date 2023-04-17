import { Component } from '@angular/core';
import { FhirChartTagsService } from './fhir-chart-tags.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { map } from 'rxjs';
import { uniq } from 'lodash-es';

@Component({
  selector: 'fhir-chart-tags-legend',
  templateUrl: './fhir-chart-tags-legend.component.html',
  styleUrls: ['./fhir-chart-tags-legend.component.css'],
})
export class FhirChartTagsLegendComponent {
  constructor(readonly tagsService: FhirChartTagsService, private layerManager: DataLayerManagerService) {}

  enabledTags$ = this.layerManager.enabledLayers$.pipe(
    map((layers) => uniq(layers.flatMap((layer) => layer.datasets.flatMap((dataset) => dataset.chartsOnFhir?.tags))))
  );
}
