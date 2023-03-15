import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataLayerManagerService, FhirChartConfigurationService, MILLISECONDS_PER_DAY } from '@elimuinformatics/ngx-charts-on-fhir';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle: string = environment.env.appTitle;
  cdsicLogo = environment.env.cdsicLogo;
  selectedIndex?: number;
  layoutMainHeight: string = '0';

  constructor(readonly layerManager: DataLayerManagerService, private configService: FhirChartConfigurationService) {}

  @ViewChild('banner') banner!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.layerManager.retrieveAll();

    this.layerManager.availableLayers$.subscribe((layers) => {
      layers.forEach((layer) => this.layerManager.select(layer.id));
    });

    const now = new Date().getTime();
    this.configService.zoom({
      min: now - 30 * MILLISECONDS_PER_DAY,
      max: now,
    });
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
    this.onResize();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.onResize());
  }

  @HostListener('window:resize') onResize() {
    if (this.banner) {
      const bannerHeight = this.banner?.nativeElement.clientHeight ?? 0;
      const tabHeight = 48;
      this.layoutMainHeight = `calc(100vh - ${bannerHeight + tabHeight}px)`;
    }
  }

  getBpLayerdata() {
    this.layerManager.retrieveAll();
    this.selectedIndex = 1;
  }
}
