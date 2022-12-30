import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { By } from '@angular/platform-browser';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { EMPTY, of } from 'rxjs';
import { RangeSelectorComponent } from './range-selector.component';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';


const mockLayerManager = {
  selectedLayers$: of([{
    datasets: [
      {
        data: [
          {
            x: 1362478965000,
            y: 69.6
          },
          {
            x: 1458037365000,
            y: 98.98
          }
        ]
      }
    ]
  }, {
    datasets: [
      {
        data: [
          {
            x: 1362478965000,
            y: 69.6
          },
          {
            x: 1458037365000,
            y: 98.98
          }
        ]
      }
    ]
  }]),
  timelineRange$: EMPTY,
  remove() { },
  update() { },
  enable() { },
  move() { },
};

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => { },
};

describe('RangeSelectorComponent', () => {
  let component: RangeSelectorComponent;
  let fixture: ComponentFixture<RangeSelectorComponent>;
  let element: DebugElement;
  let loader: HarnessLoader;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonToggleModule, MatInputModule, BrowserAnimationsModule],
      declarations: [RangeSelectorComponent],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RangeSelectorComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the range selector when one or more data layer is selected', () => {
    component.layers = [{
      id: '-109669932',
      name: 'Blood Pressure',
      category: 'vital-signs',
      annotations: [],
      selected: true,
      enabled: true,
    }];
    fixture.detectChanges();
    const cards = element.query(By.css(".range-selector"));
    expect(cards).toBeTruthy();
  });

  it('should not display the range selector when one or more data layer is selected', () => {
    component.layers = [];
    fixture.detectChanges();
    const cards = element.query(By.css(".range-selector"));
    expect(cards).toBeFalsy();
  });


  it('should calculate proper 1 month ago date from max layer date', async () => {
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers;
    })

    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='onemonth']" }));
    await ButtonInputGroup.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 1);
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 3 month ago date from max layer date', async () => {
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers;
    })

    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='threemonth']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 3);
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 6 month ago date from max layer date', async () => {
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers;
    })

    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='sixmonth']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 6);
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 12 month ago date from max layer date', async () => {
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers;
    })

    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='oneyear']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 12);
    expect(component.minDate).toEqual(expectedMinDate);
  });


  it('should reset a chart when click on all button', async () => {
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers;
    })
    spyOn(component, 'resetZoomData');
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='resetzoom']" }));
    await ButtonInput.check();
    fixture.whenStable().then(() => {
      expect(component.resetZoomData).toHaveBeenCalled();
    });
  });

  it('should minDate set on start date change', async () => {
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers;
    })
    spyOn(component, 'resetZoomData');
    let startDateInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='mindate']" }));
    await startDateInputHarness.setValue('2022-10-10');
    fixture.whenStable().then(() => {
      expect(component.minDate).toEqual('1');
    });
  });


});
