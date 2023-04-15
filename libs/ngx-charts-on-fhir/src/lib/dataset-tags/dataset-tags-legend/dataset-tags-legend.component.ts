import { Component } from '@angular/core';
import { DatasetTagsService } from '../dataset-tags.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { map } from 'rxjs';
import { uniq } from 'lodash-es';

const SVG_TRIANGLE = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M2 20 12.05 4 22 20Z"/></svg>';

@Component({
  selector: 'dataset-tags-legend',
  templateUrl: './dataset-tags-legend.component.html',
  styleUrls: ['./dataset-tags-legend.component.css'],
})
export class DatasetTagsLegendComponent {
  constructor(readonly tagsService: DatasetTagsService, private layerManager: DataLayerManagerService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('triangle', sanitizer.bypassSecurityTrustHtml(SVG_TRIANGLE));
  }

  enabledTags$ = this.layerManager.enabledLayers$.pipe(
    map((layers) => uniq(layers.flatMap((layer) => layer.datasets.flatMap((dataset) => dataset.chartsOnFhir?.tags))))
  );
}
