import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Chart } from 'chart.js';
import { EMPTY } from 'rxjs';
import { COLOR_PALETTE, DataLayerColorService } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { FhirChartConfigurationService } from './fhir-chart-configuration.service';
import { FhirChartComponent } from './fhir-chart.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
};

describe('FhirChartComponent', () => {
  let component: FhirChartComponent;
  let fixture: ComponentFixture<FhirChartComponent>;
  let mockConfigService: any;

  beforeEach(async () => {
    mockConfigService = {
      chartConfig$: EMPTY,
      chart: jasmine.createSpyObj<Chart>('Chart', ['pan']),
      zoomIn: jasmine.any(Function),
      zoomOut: jasmine.any(Function),
      isFormElementFocused: jasmine.createSpy('isFormElementFocused').and.returnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
        { provide: FhirChartConfigurationService, useValue: mockConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FhirChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    mockConfigService.chart = jasmine.createSpyObj<Chart>('Chart', ['pan']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should zoom in on "+" key press', async () => {
    component.ngOnInit();
    mockConfigService.chart = jasmine.createSpyObj<Chart>('Chart', ['pan']);
    spyOn(mockConfigService, 'zoomIn');
    const eventZoomIn = new KeyboardEvent('keydown', { key: '+' });
    component.handleKeyboardZoomAndPan(eventZoomIn);
    expect(mockConfigService.zoomIn).toHaveBeenCalled();
  });
  it('should zoom in on "-" key press', async () => {
    spyOn(mockConfigService, 'zoomOut');
    const eventZoomOut = new KeyboardEvent('keydown', { key: '-' });
    component.handleKeyboardZoomAndPan(eventZoomOut);
    expect(mockConfigService.zoomOut).toHaveBeenCalled();
  });

  it('should pan left on "ArrowLeft" key press', () => {
    const eventPanLeft = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    component.handleKeyboardZoomAndPan(eventPanLeft);
    expect(mockConfigService.chart.pan).toHaveBeenCalledWith({ x: 50 });
  });

  it('should pan right on "ArrowRight" key press', () => {
    const eventPanRight = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    component.handleKeyboardZoomAndPan(eventPanRight);
    expect(mockConfigService.chart.pan).toHaveBeenCalledWith({ x: -50 });
  });
});
