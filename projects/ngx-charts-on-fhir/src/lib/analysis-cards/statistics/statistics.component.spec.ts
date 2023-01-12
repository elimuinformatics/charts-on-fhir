import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatTableModule } from '@angular/material/table';
import { DataLayer, TimelineChartType } from '../../data-layer/data-layer';
import { StatisticsComponent } from './statistics.component';
import { VisibleData } from '../../data-layer/visible-data.service';
import { ScatterDataPoint } from 'chart.js';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent],
      imports: [MatTableModule],
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
    const layer: DataLayer<TimelineChartType, ScatterDataPoint[]> = {
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
    const visibleData: VisibleData = {
      layer,
      dataset: layer.datasets[0],
      visible: {
        data: layer.datasets[0].data,
        dateRange: { min: new Date('2022-01-01'), max: new Date('2022-01-05'), days: 5 },
      },
      previous: {
        data: [],
        dateRange: { min: new Date('2021-12-26'), max: new Date('2022-12-31'), days: 5 },
      },
    };
    fixture.componentRef.setInput('visibleData', visibleData);
    const table = await loader.getHarness(MatTableHarness);
    const values = await table.getCellTextByIndex();
    expect(values).toEqual([
      ['Timespan', '5 days', '5 days'],
      ['Days Reported', '60% (3/5 days)', '0% (0/5 days)'],
      ['Outside Goal', '67% (2/3 days)', 'N/A'],
      ['Average', '3', 'N/A'],
      ['Median', '3', 'N/A'],
    ]);
  });
});
