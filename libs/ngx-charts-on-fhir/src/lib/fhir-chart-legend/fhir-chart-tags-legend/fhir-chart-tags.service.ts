import { Injectable } from '@angular/core';
import { Dataset, TimelineChartType } from '../../data-layer/data-layer';
import { ChartType, ChartTypeRegistry } from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { merge } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import produce, { castDraft } from 'immer';

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
      pointStyle: 'triangle',
    },
    Clinic: {
      pointStyle: 'circle',
    },
  });

  tagStyles$ = this.tagStyles.asObservable();

  setTagStyles(newTagStyles: TagStyles) {
    this.tagStyles.next(
      produce(this.tagStyles.value, (draft) => {
        Object.assign(draft, castDraft(newTagStyles));
      })
    );
  }
  applyTagStyles(dataset: Dataset) {
    for (let tag of dataset.chartsOnFhir?.tags ?? []) {
      merge(dataset, this.tagStyles.value[tag]);
    }
  }
}
