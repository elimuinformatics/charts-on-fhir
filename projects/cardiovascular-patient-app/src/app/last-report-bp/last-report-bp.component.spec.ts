import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastReportBPComponent } from './last-report-bp.component';
import { MatCardModule } from '@angular/material/card';
import { DataLayerManagerService } from 'ngx-charts-on-fhir';
import { EMPTY, map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

const mockLayerManager = {
  availableLayers$: EMPTY,
  selectedLayers$: EMPTY,
  allLayers$: EMPTY
};

describe('LastReportBPComponent', () => {
  let component: LastReportBPComponent;
  let fixture: ComponentFixture<LastReportBPComponent>;
  let scheduler: TestScheduler;
  let myService: DataLayerManagerService;

  beforeEach(async () => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    const spy = jasmine.createSpyObj('DataLayerManagerService', ['allLayers$', 'availableLayers$', 'allLayers$']);
    spy.allLayers$ = EMPTY
    spy.availableLayers$ = EMPTY
    spy.allLayers$ = EMPTY
    await TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [LastReportBPComponent],
      providers: [{ provide: DataLayerManagerService, useValue: spy }],

    }).compileComponents();

    fixture = TestBed.createComponent(LastReportBPComponent);
    component = fixture.componentInstance;
    myService = TestBed.inject(DataLayerManagerService) as jasmine.SpyObj<DataLayerManagerService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract the last data point of each dataset in the "Blood Pressure" layer', () => {
    scheduler.run(({ cold, expectObservable }) => {
      myService.allLayers$ = cold('a', {
        a: [
          {
            name: 'a',
            id: '123',
            enabled: true,
            datasets: [
              {
                data: [
                  { x: 10, y: 100 },
                  { x: 20, y: 200 },
                ],
              },
              {
                data: [
                  { x: 10, y: 100 },
                  { x: 20, y: 200 },
                ],
              },
            ],
            scale: { id: 'a' },
          },
          {
            name: 'Blood Pressure',
            id: '567',
            enabled: true,
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
            scale: { id: 'a' },
          }
        ],
      });
      const layers$ = myService.allLayers$;
      const result$ = layers$.pipe(
        map((layers) =>
          layers
            .filter((layer) => layer.name === 'Blood Pressure')
            .map((layer) => layer.datasets.map((data) => data.data))
            .map((layer) => layer.map((data) => data.slice(-1)))
        )
      );
      expectObservable(result$).toBe('a', {
        a: [[[{ x: 1352359652, y: 122 }], [{ x: 1476359652, y: 78 }]]],
      });
    });
  })

});
