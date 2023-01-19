import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { By } from '@angular/platform-browser';
import { MatButtonToggleHarness } from '@angular/material/button-toggle/testing';
import { of } from 'rxjs';
import { RangeSelectorComponent } from './range-selector.component';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { FhirChartConfigurationService } from '../fhir-chart-configuration.service';


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
            x: 1473505702,
            y: 69.6
          },
          {
            x: 1573505702,
            y: 93.98
          }
        ]
      }
    ]
  }, {
    datasets: [
      {
        data: [
          {
            x: 1373505702,
            y: 69.6
          },
          {
            x: 1173505702,
            y: 94.98
          }
        ]
      }
    ]
  }]),
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
      imports: [MatButtonToggleModule, MatInputModule, FormsModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule],
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
    const cards = element.query(By.css(".range-selector"));
    expect(cards).toBeTruthy();
  });

  it('should not display the range selector when no data layer is selected', () => {
    component.layers = [];
    fixture.detectChanges();
    const cards = element.query(By.css(".range-selector"));
    expect(cards).toBeFalsy();
  });


  it('should calculate proper 1 month ago date from max layer date', async () => {
    let ButtonInputGroup = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 mo']" }));
    await ButtonInputGroup.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 1);
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 3 month ago date from max layer date', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='3 mo']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 3);
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 6 month ago date from max layer date', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='6 mo']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 6);
    expect(component.minDate).toEqual(expectedMinDate);
  });

  it('should calculate proper 12 month ago date from max layer date', async () => {
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='1 y']" }));
    await ButtonInput.check();
    const expectedMinDate = new Date(component.maxDate);
    expectedMinDate.setMonth(new Date(component.maxDate).getMonth() - 12);
    expect(component.minDate).toEqual(expectedMinDate);
  });


  it('should reset a chart when click on all button', async () => {
    spyOn(component, 'resetZoomChart');
    component.resetZoomChart()
    let ButtonInput = await loader.getHarness(MatButtonToggleHarness.with({ selector: "[id='resetzoom']" }));
    await ButtonInput.check();
    fixture.whenStable().then(() => {
      expect(component.resetZoomChart).toHaveBeenCalled();
    });
  });

  it('should check dateChange selected event for start date', () => {
    const date: any = { value: new Date(2020, 2, 2) };
    component.dateChange(date, 'min');
    fixture.detectChanges();
    expect(component.minDate).toEqual(date.value);
  });


  it('should check dateChange selected event for end date', () => {
    const date: any = { value: new Date(2020, 2, 2) };
    component.dateChange(date, 'max');
    fixture.detectChanges();
    expect(component.maxDate).toEqual(date.value);
  });

  it('should check maxDate and minDate', async () => {
    component.getLayerRangeFromLayers()
    const componentMindate = new Date(component.layerRange.min).getTime()
    const componentMaxdate = new Date(component.layerRange.max).getTime()
    expect(componentMaxdate).toEqual(component.layers?.[0].datasets[0].data[1].x as number);
    expect(componentMindate).toEqual(component.layers?.[2].datasets[0].data[1].x as number);
  })

  it('should check month difference between two dates', async () => {
    const componentMaxdate = new Date();
    const componentMindate = new Date();
    const monthCount = 1;
    componentMindate.setMonth(componentMindate.getMonth() - monthCount);
    let months = component.calculateMonthDiff(componentMindate, componentMaxdate)
    expect(months).toEqual(monthCount)
  })

});
