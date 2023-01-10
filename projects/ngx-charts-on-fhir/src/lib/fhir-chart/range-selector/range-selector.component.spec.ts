import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { By } from '@angular/platform-browser';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { EMPTY, of } from 'rxjs';
import { RangeSelectorComponent } from './range-selector.component';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { DataLayer, } from '../../data-layer/data-layer';


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
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getMaxDateFromLayers(layers);
      component.layers = layers as DataLayer[];
    })
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
      component.layers = layers as DataLayer[];
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
      component.layers = layers as DataLayer[];
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
      component.layers = layers as DataLayer[];;
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
      component.layers = layers as DataLayer[];;
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
      component.layers = layers as DataLayer[];;
    })
    spyOn(component, 'resetZoomData');
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='resetzoom']" }));
    await ButtonInput.check();
    fixture.whenStable().then(() => {
      expect(component.resetZoomData).toHaveBeenCalled();
    });
  });

  it('should check dateChange selected event for start date', () => {
    const date: any = { value : new Date(2020, 2, 2) };
    component.dateChange(date , 'min');
    fixture.detectChanges();
    expect(component.minDate).toEqual(date.value);
  });


  it('should check dateChange selected event for end date', () => {
    const date: any = { value : new Date(2020, 2, 2) };
    component.dateChange(date , 'max');
    fixture.detectChanges();
    expect(component.maxDate).toEqual(date.value);
  });

});
