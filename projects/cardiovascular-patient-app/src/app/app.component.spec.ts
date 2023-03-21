import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTabsModule } from '@angular/material/tabs';
import { COLOR_PALETTE, DataLayerService, FhirChartComponent, LegendPosition } from '@elimuinformatics/ngx-charts-on-fhir';
import { EMPTY } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import paletteProvider from './providers/palette-provider';
import { By } from '@angular/platform-browser';

class MockDataLayerService implements DataLayerService {
  name = 'MockDataLayerService';
  retrieve = () => EMPTY;
}

@Component({ selector: 'fhir-chart' })
class MockFhirChartComponent {
  @Input() legendPosition?: LegendPosition;
}

@Component({ selector: 'fhir-chart-summary' })
class MockFhirChartSummaryComponent {}

@Component({ selector: 'last-report-bp' })
class MockLastReportBPComponent {}

@Component({ selector: 'report-bp' })
class MockReportBPComponent {
  @Output() resourceCreated = new EventEmitter<number>();
}

@Component({ selector: 'options-menu' })
class MockOptionsMenuComponent {
  @Input() chart?: FhirChartComponent;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockFhirChartComponent,
        MockFhirChartSummaryComponent,
        MockLastReportBPComponent,
        MockReportBPComponent,
        MockOptionsMenuComponent,
      ],
      imports: [NoopAnimationsModule, MatTabsModule, MatCardModule, MatToolbarModule],
      providers: [
        { provide: DataLayerService, useClass: MockDataLayerService, multi: true },
        { provide: COLOR_PALETTE, useValue: paletteProvider },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should select the second tab when BP resource is created', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabHarness = await tabGroup.getTabs();
    expect(await tabHarness[1].isSelected()).toBe(false);
    const reportBPComponent = fixture.debugElement.query(By.directive(MockReportBPComponent));
    reportBPComponent.componentInstance.resourceCreated.next(1);
    expect(await tabHarness[1].isSelected()).toBe(true);
  });
});
