import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { DataLayer } from '../data-layer/data-layer';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export type DataLayerViews = Record<string, DataLayerView>;
export type DataLayerView = {
  selected: string[];
  enabled: string[];
};

@Component({
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  selector: 'data-layer-selector',
  templateUrl: './data-layer-selector.component.html',
  styleUrls: ['./data-layer-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataLayerSelectorComponent implements OnChanges {
  @Input() views: DataLayerViews = {};
  @Input() active?: string;

  constructor(
    private readonly layerManager: DataLayerManagerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  unsubscribe$ = new Subject<void>();

  ngOnChanges() {
    this.onSelectionChange(this.active);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelectionChange(name?: string) {
    this.unsubscribe$.next();
    this.active = name;
    if (name) {
      const view = this.views[name];
      this.layerManager.autoSelect((layer) => view.selected.includes(layer.name));
      this.layerManager.autoEnable((layer) => view.enabled.includes(layer.name));
      this.layerManager.autoSort(sortCompareFn(view));
      this.layerManager.settings$.pipe(takeUntil(this.unsubscribe$)).subscribe(({ isAutoSelect, isAutoEnable, isAutoSort }) => {
        if (!isAutoSelect || !isAutoEnable || !isAutoSort) {
          this.active = undefined;
          this.changeDetectorRef.markForCheck();
        }
      });
    }
  }
}

function sortCompareFn(view: DataLayerView) {
  return (a: DataLayer, b: DataLayer) => {
    let ai = view.enabled.indexOf(a.name);
    let bi = view.enabled.indexOf(b.name);
    if (ai >= 0 && bi >= 0) {
      // if both layers are enabled, sort by position in enabled list
      return ai - bi;
    } else {
      // if a layer is disabled, sort by position in selected list
      ai = view.selected.indexOf(a.name);
      bi = view.selected.indexOf(b.name);
      return ai - bi;
    }
  };
}
