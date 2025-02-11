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

  describe('triggerKeyboardEvent', () => {
    function triggerKeyboardEvent(key: string) {
      const event = new KeyboardEvent('keydown', { key });
      document.dispatchEvent(event);
    }
    it('should zoom in on "+" key press', () => {
      spyOn(mockConfigService, 'zoomIn');
      triggerKeyboardEvent('+');
      expect(mockConfigService.zoomIn).toHaveBeenCalled();
    });

    it('should zoom out on "-" key press', () => {
      spyOn(mockConfigService, 'zoomOut');
      triggerKeyboardEvent('-');
      expect(mockConfigService.zoomOut).toHaveBeenCalled();
    });

    it('should pan left on "ArrowLeft" key press', () => {
      triggerKeyboardEvent('ArrowLeft');
      expect(mockConfigService.chart.pan).toHaveBeenCalledWith({ x: 50 });
    });

    it('should pan right on "ArrowRight" key press', () => {
      triggerKeyboardEvent('ArrowRight');
      expect(mockConfigService.chart.pan).toHaveBeenCalledWith({ x: -50 });
    });

    it('should not trigger zoom or pan when form element is focused', () => {
      spyOn(component, 'isFormElementFocused').and.returnValue(true);
      spyOn(mockConfigService, 'zoomIn');
      triggerKeyboardEvent('+');
      expect(mockConfigService.zoomIn).not.toHaveBeenCalled();
    });
  });

  describe('isFormElementFocused', () => {
    it('should return true if an form fields is focused', () => {
      const inputElement = document.createElement('input');
      document.body.appendChild(inputElement);
      inputElement.focus();
      expect(component.isFormElementFocused()).toBe(true);
      document.body.removeChild(inputElement);

      const textareaElement = document.createElement('textarea');
      document.body.appendChild(textareaElement);
      textareaElement.focus();
      expect(component.isFormElementFocused()).toBe(true);

      const selectElement = document.createElement('select');
      document.body.appendChild(selectElement);
      selectElement.focus();
      expect(component.isFormElementFocused()).toBe(true);
      document.body.removeChild(selectElement);

      const buttonElement = document.createElement('button');
      document.body.appendChild(buttonElement);
      buttonElement.focus();
      expect(component.isFormElementFocused()).toBe(true);
      document.body.removeChild(buttonElement);
    });

    it('should return false if no form element is focused', () => {
      const divElement = document.createElement('div');
      document.body.appendChild(divElement);
      divElement.focus();
      expect(component.isFormElementFocused()).toBe(false);
      document.body.removeChild(divElement);
    });
  });
});
