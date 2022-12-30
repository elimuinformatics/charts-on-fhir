import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { By } from '@angular/platform-browser';
import {MatButtonToggleGroupHarness, MatButtonToggleHarness} from '@angular/material/button-toggle/testing';



import { EMPTY } from 'rxjs';
import { RangeSelectorComponent } from './range-selector.component';
import { DataLayerColorService } from '../../data-layer/data-layer-color.service';
import { DebugElement } from '@angular/core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';


const mockLayerManager = {
  selectedLayers$: EMPTY,
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
      imports: [],
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


  it('should not display the range selector when one or more data layer is selected', async () => {
    // component.layers = [{
    //   datasets: [
    //     {
    //       data: [
    //         {
    //           x: 1362478965000,
    //           y: 69.6
    //         },
    //         {
    //           x: 1458037365000,
    //           y: 98.98
    //         }
    //       ]
    //     }
    //   ]
    // }, {
    //   datasets: [
    //     {
    //       data: [
    //         {
    //           x: 1362478965000,
    //           y: 69.6
    //         },
    //         {
    //           x: 1458037365000,
    //           y: 98.98
    //         }
    //       ]
    //     }
    //   ]
    // }];
    // fixture.detectChanges();
    // let ButtonInputHarness = await loader.getHarness(MatButtonToggleGroupHarness.with({ selector: "[class='mat-button-toggle-group']" }));
    const ButtonInputGroup = element.query(By.css(".mat-button-toggle-group"));
    // const cards = element.query(By.css(".range-selector"));
    expect(ButtonInputGroup).toBeFalsy();
  });



});
