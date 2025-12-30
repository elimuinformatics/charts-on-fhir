import { Injectable } from '@angular/core';
import { ChartType, ChartTypeRegistry } from 'chart.js';
import { castDraft, produce } from 'immer';
import { merge } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { Dataset, DeepPartial, TimelineChartType } from '../../data-layer/data-layer';

type DatasetOptions<TType extends TimelineChartType = TimelineChartType> = DeepPartial<
  { [key in ChartType]: { type: key } & ChartTypeRegistry[key]['datasetOptions'] }[TType]
>;

type TagStyles = Record<string, DatasetOptions>;

@Injectable({
  providedIn: 'root',
})
export class FhirChartTagsService {
  private tagStyles = new BehaviorSubject<TagStyles>({
    Home: {
      pointStyle: 'rectRot',
      pointRadius: 3,
      borderWidth: 1,
    },
    Clinic: {
      pointStyle: 'circle',
      pointRadius: 5,
    },
  });

  tagStyles$ = this.tagStyles.asObservable();

  setTagStyles(newTagStyles: TagStyles) {
    this.tagStyles.next(
      produce(this.tagStyles.value, (draft) => {
        Object.assign(draft, castDraft(newTagStyles));
      }),
    );
  }
  applyTagStyles(dataset: Dataset) {
    for (let tag of dataset.chartsOnFhir?.tags ?? []) {
      merge(dataset, this.tagStyles.value[tag]);
    }
  }
}
