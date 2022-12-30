import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSortHeaderHarness } from '@angular/material/sort/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { ManagedDataLayer } from '../data-layer/data-layer';
import { DataLayerColorService, COLOR_PALETTE } from '../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { DataLayerBrowserComponent } from './data-layer-browser.component';
import { DataLayerBrowserModule } from './data-layer-browser.module';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

class MockLayerManager {
  availableLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
  selectedLayers$ = EMPTY;
  timelineRange$ = EMPTY;
  loading$ = EMPTY;
}

describe('DataLayerBrowserComponent', () => {
  let component: DataLayerBrowserComponent;
  let fixture: ComponentFixture<DataLayerBrowserComponent>;
  let loader: HarnessLoader;
  let layerManager: MockLayerManager;

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    await TestBed.configureTestingModule({
      imports: [DataLayerBrowserModule, NoopAnimationsModule],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager },
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerBrowserComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display available layers', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'One',
        category: ['A', 'B'],
        datasets: [{ data: [{ x: 1, y: 1 }] }],
        scales: {},
      },
      {
        id: '2',
        name: 'Two',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 2, y: 2 },
              { x: 3, y: 3 },
            ],
          },
        ],
        scales: {},
      },
    ];
    layerManager.availableLayers$.next(layers);
    const table = await loader.getHarness(MatTableHarness);
    const values = await table.getCellTextByColumnName();
    expect(values).toEqual(
      jasmine.objectContaining({
        name: jasmine.objectContaining({ text: ['One', 'Two'] }),
        category: jasmine.objectContaining({ text: ['A, B', 'C, D'] }),
        datapoints: jasmine.objectContaining({ text: ['1', '2'] }),
      })
    );
  });

  it('should filter layers by category', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'One',
        category: ['A'],
        datasets: [{ data: [] }],
        scales: {},
      },
      {
        id: '2',
        name: 'Two',
        category: ['C'],
        datasets: [{ data: [] }],
        scales: {},
      },
    ];
    layerManager.availableLayers$.next(layers);
    const filter = await loader.getHarness(MatInputHarness);
    await filter.setValue('A');
    const table = await loader.getHarness(MatTableHarness);
    const values = await table.getCellTextByColumnName();
    expect(values).toEqual(
      jasmine.objectContaining({
        category: jasmine.objectContaining({ text: ['A'] }),
      })
    );
  });

  it('should sort layers by category', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'One',
        category: ['B'],
        datasets: [{ data: [] }],
        scales: {},
      },
      {
        id: '2',
        name: 'Two',
        category: ['C'],
        datasets: [{ data: [] }],
        scales: {},
      },
      {
        id: '3',
        name: 'Three',
        category: ['A'],
        datasets: [{ data: [] }],
        scales: {},
      },
    ];
    layerManager.availableLayers$.next(layers);
    const categorySort = await loader.getHarness(MatSortHeaderHarness.with({label: 'Category'}));
    await categorySort.click();
    const table = await loader.getHarness(MatTableHarness);
    const values = await table.getCellTextByColumnName();
    expect(values).toEqual(
      jasmine.objectContaining({
        category: jasmine.objectContaining({ text: ['A', 'B', 'C'] }),
      })
    );
  });

});
