import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatTableModule } from '@angular/material/table';
import { DataLayer } from '../../data-layer/data-layer';
import { StatisticsComponent } from './statistics.component';
import { of } from 'rxjs';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';


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
}
const layer: DataLayer = {
  name: 'Layer',
  datasets: [
    {
      label: 'Test',
      data: [
        { x: new Date('2022-01-01').getTime(), y: 1 },
        { x: new Date('2022-01-02').getTime(), y: 3 },
        { x: new Date('2022-01-03').getTime(), y: 5 },
      ],
    },
  ],
  scales: {},
  annotations: [
    {
      label: { content: 'Test Reference Range' },
      yMin: 2,
      yMax: 4,
      yScaleID: 'Scale',
    },
  ],
};
describe('AnalysisStatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent],
      imports: [MatTableModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display statistics for the dataset', async () => {
    fixture.componentRef.setInput('layer', layer);
    fixture.componentRef.setInput('dataset', layer.datasets[0]);
    fixture.componentRef.setInput('visibleData', layer.datasets[0].data);
    fixture.componentRef.setInput('dateRange', { days: 5 });
    const table = await loader.getHarness(MatTableHarness);
    const values = await table.getCellTextByIndex();
    // MatTableHarness does not support <th scope="row"> so we have to check by row index instead of row header text.
    expect(values).toEqual([
      ['Current'],//summary
      ['5 days'], // Timespan
      ['60% (3/5 days)'], // Days Reported
      ['67% (2/3 days)'], // Outside Goal
      ['3'], // Average
      ['3'], // Median
    ]);
  });

  it('should calculate proper 1 month ago date from min layer date', async () => {
    component.getMaxMinDate(layer.datasets[0].data)
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getPreviousDataFromLayers(layers, 1);
      // component.layers = layers as DataLayer[];
    })
    component.diff_months_count(component.dateRange.min, component.dateRange.max)
    const expectedPreviousDate = new Date(component.dateRange.min);
    expectedPreviousDate.setMonth(new Date(component.dateRange.min).getMonth() - 1);
    expect(component.previousDate).toEqual(expectedPreviousDate);
  });

  it('should calculate proper 3 month ago date from min layer date', async () => {  
    component.getMaxMinDate(layer.datasets[0].data)
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getPreviousDataFromLayers(layers, 3);
      // component.layers = layers as DataLayer[];
    })
    component.diff_months_count(component.dateRange.min, component.dateRange.max)
    const expectedPreviousDate = new Date(component.dateRange.min);
    expectedPreviousDate.setMonth(new Date(component.dateRange.min).getMonth() - 3);
    expect(component.previousDate).toEqual(expectedPreviousDate);
  });

  it('should calculate proper 6 month ago date from min layer date', async () => {  
    component.getMaxMinDate(layer.datasets[0].data)
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getPreviousDataFromLayers(layers, 6);
      // component.layers = layers as DataLayer[];
    })
    component.diff_months_count(component.dateRange.min, component.dateRange.max)
    const expectedPreviousDate = new Date(component.dateRange.min);
    expectedPreviousDate.setMonth(new Date(component.dateRange.min).getMonth() - 6);
    expect(component.previousDate).toEqual(expectedPreviousDate);
  });
  
  it('should calculate proper 12 month ago date from min layer date', async () => {  
    component.getMaxMinDate(layer.datasets[0].data)
    mockLayerManager.selectedLayers$.subscribe((layers) => {
      component.getPreviousDataFromLayers(layers, 12);
      // component.layers = layers as DataLayer[];
    })
    component.diff_months_count(component.dateRange.min, component.dateRange.max)
    const expectedPreviousDate = new Date(component.dateRange.min);
    expectedPreviousDate.setMonth(new Date(component.dateRange.min).getMonth() - 12);
    expect(component.previousDate).toEqual(expectedPreviousDate);
  });

});
