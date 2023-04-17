import { Component } from '@angular/core';
import { DatasetTagsService } from './dataset-tags.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { map } from 'rxjs';
import { uniq } from 'lodash-es';

@Component({
  selector: 'dataset-tags-legend',
  templateUrl: './dataset-tags-legend.component.html',
  styleUrls: ['./dataset-tags-legend.component.css'],
})
export class DatasetTagsLegendComponent {
  constructor(readonly tagsService: DatasetTagsService, private layerManager: DataLayerManagerService) {}

  enabledTags$ = this.layerManager.enabledLayers$.pipe(
    map((layers) => uniq(layers.flatMap((layer) => layer.datasets.flatMap((dataset) => dataset.chartsOnFhir?.tags))))
  );
}
