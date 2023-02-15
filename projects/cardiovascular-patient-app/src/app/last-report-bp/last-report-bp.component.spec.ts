import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastReportBPComponent } from './last-report-bp.component';
import { DataLayerManagerService, ManagedDataLayer } from 'ngx-charts-on-fhir';
import { BehaviorSubject, EMPTY, map } from 'rxjs';
import { formatDate, formatTime } from 'ngx-charts-on-fhir';
import { LastReportBPModule } from './last-report-bp.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
class MockLayerManager {
  allLayers$ = new BehaviorSubject<ManagedDataLayer[]>([]);
  selectedLayers$ = EMPTY;
  availableLayers$ = EMPTY;
}

describe('LastReportBPComponent', () => {
  let component: LastReportBPComponent;
  let fixture: ComponentFixture<LastReportBPComponent>;
  let layerManager: MockLayerManager;
  let loader: HarnessLoader;

  beforeEach(async () => {
    layerManager = new MockLayerManager();
    await TestBed.configureTestingModule({
      imports: [LastReportBPModule, NoopAnimationsModule],
      providers: [
        { provide: DataLayerManagerService, useValue: layerManager }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LastReportBPComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract the last data point of each dataset in the "Blood Pressure" layer', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Blood Pressure',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1352359652, y: 120 },
              { x: 1352359652, y: 122 },
            ],
          },
          {
            data: [
              { x: 1476359652, y: 80 },
              { x: 1476359652, y: 78 },
            ],
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);

    const result$ = layerManager.allLayers$.pipe(
      map((layers) =>
        layers
          .filter((layer) => layer.name === 'Blood Pressure')
          .map((layer) => layer.datasets.map((data) => data.data))
          .map((layer) => layer.map((data) => data.slice(-1)))
      )
    );
    result$.subscribe(layers => {
      const lastReportedBPdata = {
        systolic: { date: `${formatDate(layers[0][1][0].x)}`, value: layers[0][1][0].y },
        diastolic: { date: `${formatDate(layers[0][0][0].x)}`, value: layers[0][0][0].y },
      };
      expect(lastReportedBPdata).toEqual({ systolic: { date: '18 Jan 1970', value: 78 }, diastolic: { date: '16 Jan 1970', value: 122 } });
    })
  });

});
