import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatTableModule } from '@angular/material/table';
import { DataLayer } from '../../data-layer/data-layer';
import { StatisticsComponent } from './statistics.component';

describe('AnalysisStatisticsComponent', () => {
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
    fixture.componentRef.setInput('layer', layer);
    fixture.componentRef.setInput('dataset', layer.datasets[0]);
    fixture.componentRef.setInput('visibleData', layer.datasets[0].data);
    fixture.componentRef.setInput('dateRange', { days: 5 });
    const table = await loader.getHarness(MatTableHarness);
    const values = await table.getCellTextByIndex();
    // MatTableHarness does not support <th scope="row"> so we have to check by row index instead of row header text.
    expect(values).toEqual([
      ['5 days'], // Timespan
      ['60% (3/5 days)'], // Days Reported
      ['67% (2/3 days)'], // Outside Goal
      ['3'], // Average
      ['3'], // Median
    ]);
  });

});
