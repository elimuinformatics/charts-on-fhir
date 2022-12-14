import {
  Component,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Inject,
  InjectionToken,
  OnChanges,
  OnInit,
  SimpleChanges,
  Type,
  ViewChild,
} from '@angular/core';
import { ceil } from 'lodash-es';
import { distinctUntilChanged, throttleTime } from 'rxjs';
import { DataLayer, Dataset, TimelineDataPoint } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { MILLISECONDS_PER_DAY } from '../utils';
import { AnalysisCardContent } from './analysis-card-content.component';
import { AnalysisCardHostDirective } from './analysis-card-host.directive';
import { AnalysisCardComponent } from './analysis-card/analysis-card.component';

export const ANALYSIS_CARDS = new InjectionToken<Type<AnalysisCardContent>>('ANALYSIS_CARDS');

type CardContext = {
  layer: DataLayer;
  dataset: Dataset;
  cardRef: ComponentRef<AnalysisCardComponent>;
  cardContentRef: ComponentRef<AnalysisCardContent>;
};

@Component({
  selector: 'analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit, OnChanges {
  constructor(
    public layerManager: DataLayerManagerService,
    @Inject(ANALYSIS_CARDS) private cardTypes: Type<AnalysisCardContent>[],
    private environmentInjector: EnvironmentInjector
  ) {}

  private layers: DataLayer[] = [];
  private range = { min: 0, max: 0 };
  private cardContexts: CardContext[] = [];

  @ViewChild(AnalysisCardHostDirective, { static: true }) cardHost!: AnalysisCardHostDirective;

  ngOnInit(): void {
    this.layerManager.selectedLayers$
      .pipe(distinctUntilChanged((previous, current) => previous.length === current.length && previous.every((layer, i) => layer === current[i])))
      .subscribe((layers) => {
        this.layers = layers;
        this.createCards();
      });
    // throttleTime is needed so we don't reduce performance by triggering change detection too often.
    this.layerManager.timelineRange$.pipe(throttleTime(100, undefined, { leading: true, trailing: true })).subscribe((range) => {
      this.range = range;
      for (let ctx of this.cardContexts) {
        this.refreshCard(ctx);
      }
      this.prioritizeCards();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('analysis changes', changes);
  }

  createCards() {
    this.cardContexts = [];
    for (let cardType of this.cardTypes) {
      for (let layer of this.layers) {
        for (let dataset of layer.datasets) {
          const cardContentRef = createComponent(cardType, { environmentInjector: this.environmentInjector });
          const cardRef = createComponent(AnalysisCardComponent, {
            environmentInjector: this.environmentInjector,
            projectableNodes: [[cardContentRef.location.nativeElement]],
          });
          const ctx = { layer, dataset, cardRef, cardContentRef };
          this.cardContexts.push(ctx);
          this.refreshCard(ctx);
        }
      }
    }
    this.prioritizeCards();
  }

  private prioritizeCards() {
    const prioritizedCards = this.cardContexts
      .filter((ctx) => !ctx.dataset.hidden && ctx.cardContentRef.instance.priority > 0)
      .sort((a, b) => b.cardContentRef.instance.priority - a.cardContentRef.instance.priority);
    while (this.cardHost.viewContainerRef.length > 0) {
      this.cardHost.viewContainerRef.detach(0);
    }
    for (let ctx of prioritizedCards) {
      this.cardHost.viewContainerRef.insert(ctx.cardRef.hostView);
    }
  }

  private refreshCard({ layer, dataset, cardRef, cardContentRef }: CardContext) {
    cardRef.setInput('title', cardContentRef.instance.title);
    cardRef.setInput('icon', cardContentRef.instance.icon);
    cardRef.setInput('dataset', dataset);
    cardContentRef.setInput('layer', layer);
    cardContentRef.setInput('dataset', dataset);
    cardContentRef.setInput('visibleData', this.getVisibleData(dataset));
    cardContentRef.setInput('dateRange', {
      min: new Date(this.range.min),
      max: new Date(this.range.max),
      days: ceil((this.range.max - this.range.min) / MILLISECONDS_PER_DAY),
    });
    cardContentRef.changeDetectorRef.detectChanges();
  }

  private getVisibleData(dataset: Dataset): TimelineDataPoint[] {
    return dataset.data.filter((point) => this.range.min <= point.x && point.x <= this.range.max);
  }
}
