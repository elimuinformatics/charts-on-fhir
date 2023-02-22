import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastReportBPComponent, LastReportedBPdata } from './last-report-bp.component';
import { DataLayerManagerService, ManagedDataLayer } from 'ngx-charts-on-fhir';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { LastReportBPModule } from './last-report-bp.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCardHarness } from '@angular/material/card/testing';


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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct message for systolic and diastolic of last reported prior BP with multiple measurements', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Blood Pressure',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1609175027000, y: 120 },
              { x: 1609175027000, y: 122 },
            ],
            label: "Diastolic Blood Pressure"
          },
          {
            data: [
              { x: 1676536294000, y: 80 },
              { x: 1676536294000, y: 78 },
            ],
            label: "Systolic Blood Pressure"
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);

    const cardHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MatCardHarness);
    const contentText = await cardHarness.getText();

    const expectedOutput: LastReportedBPdata = {
      systolic: { date: new Date(1676536294000).toUTCString(), value: 78 },
      diastolic: { date: new Date(1676536294000).toUTCString(), value: 122 },
    };
    expect(contentText).toContain(`Last BP reported was ${component?.lastReportedBPdata?.systolic.value }/${ component?.lastReportedBPdata?.diastolic.value } on ${component.formatDate(expectedOutput.systolic.date)} at ${component.formatTime(expectedOutput.systolic.date)}`);
  });

  it('should show correct text for systolic and diastolic values of last reported prior BP if the Blood Pressure layer has no datasets', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Medications',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1609175027000, y: 120 },
              { x: 1609175027000, y: 122 },
            ],
          },
          {
            data: [
              { x: 1676536294000, y: 80 },
              { x: 1676536294000, y: 78 },
            ],
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);
    const cardHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MatCardHarness);
    const contentText = await cardHarness.getText();
    expect(contentText).toContain('There is no last reported prior BP for Patient');
  });

  it('should return the correct systolic and diastolic most recent blood pressure values for a patient with multiple measurements', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Blood Pressure',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1609175027000, y: 120 },
              { x: 1676536294000, y: 122 },
            ],
            label: "Diastolic Blood Pressure"
          },
          {
            data: [
              { x: 1609175027000, y: 80 },
              { x: 1676536294000, y: 78 },
            ],
            label: "Systolic Blood Pressure"
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);
    const expectedOutput: LastReportedBPdata = {
      systolic: { date: 1676536294000, value: 78 },
      diastolic: { date: 1676536294000, value: 122 },
    };
    expect(component.lastReportedBPdata).toEqual(expectedOutput)
  })

  it('should return undefined for systolic and diastolic values if the Blood Pressure layer has no datasets', async () => {
    const layers: ManagedDataLayer[] = [
      {
        id: '1',
        name: 'Medication',
        category: ['C', 'D'],
        datasets: [
          {
            data: [
              { x: 1609175027000, y: 120 },
              { x: 1676536294000, y: 122 },
            ],
            label: "Diastolic Blood Pressure"
          },
          {
            data: [
              { x: 1609175027000, y: 80 },
              { x: 1676536294000, y: 78 },
            ],
            label: "Systolic Blood Pressure"
          },
        ],
        scale: { id: '1' },
      },
    ];
    layerManager.allLayers$.next(layers);

    expect(component.lastReportedBPdata).toEqual(undefined)
  })
})
