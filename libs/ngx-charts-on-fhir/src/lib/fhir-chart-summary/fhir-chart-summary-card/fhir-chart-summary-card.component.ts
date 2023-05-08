import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FhirChartConfigurationService } from '../../fhir-chart/fhir-chart-configuration.service';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { SummaryService } from '../summary.service';
import { NumberRange } from '../../utils';

@Component({
  selector: 'fhir-chart-summary-card',
  templateUrl: './fhir-chart-summary-card.component.html',
  styleUrls: ['./fhir-chart-summary-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FhirChartSummaryCardComponent {
  @Input() layer!: DataLayer;
  _expanded = false;
  get expanded() {
    return this._expanded;
  }
  @Input() set expanded(value: boolean) {
    this._expanded = value;
    if (this._expanded) {
      this.expand.next();
    } else {
      this.collapse.next();
    }
  }
  @Output() expand = new EventEmitter<void>();
  @Output() collapse = new EventEmitter<void>();

  constructor(
    public configService: FhirChartConfigurationService,
    private colorService: DataLayerColorService,
    private elementRef: ElementRef,
    @Inject(SummaryService) private summaryServices: SummaryService[],
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  overlayPositions: ConnectionPositionPair[] = [{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: -8 }];

  get collapsedWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }
  get collapsedHeight(): number {
    return this.elementRef.nativeElement.offsetHeight;
  }
  get contentOverflow() {
    return this.elementRef.nativeElement.scrollHeight > this.elementRef.nativeElement.offsetHeight;
  }

  private resizeObserver?: ResizeObserver;

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.changeDetectorRef.markForCheck();
    });
    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getTooltip() {
    if (this.contentOverflow) {
      return 'Click to expand this card';
    } else {
      return '';
    }
  }

  getBackgroundStyle() {
    if (this.layer) {
      const gradient = this.colorService.getColorGradient(this.layer);
      // Use multiple background layers to apply a gradient to the border while keeping the rest of the card white
      return `linear-gradient(white, white) padding-box, ${gradient} border-box`;
    }
    return undefined;
  }

  summarize(range: NumberRange | null) {
    if (range) {
      for (let summaryService of this.summaryServices) {
        if (summaryService.canSummarize(this.layer)) {
          return summaryService.summarize(this.layer, range);
        }
      }
    }
    return [{}];
  }
}
