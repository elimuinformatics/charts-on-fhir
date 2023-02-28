import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { MatTabGroupHarness } from '@angular/material/tabs/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTabsModule } from '@angular/material/tabs';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule ,MatTabsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the first tab selected', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabHarnesses = await tabGroup.getTabs()
    const selectedTab = await tabHarnesses[0].isSelected();
    expect(selectedTab).toBe(true);
  });

  it('should select the second tab when clicked', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabHarness = await tabGroup.getTabs();
    const systolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='systolic']" }));
    await systolicInputHarness.setValue('110');
    const diastolicInputHarness = await loader.getHarness(MatInputHarness.with({ selector: "[id='diastolic']" }));
    await diastolicInputHarness.setValue('70');
    const submitButtonHarness = await loader.getHarness(MatButtonHarness.with({ selector: "[id='submit']" }));
    await submitButtonHarness.click();
    component.getSelectedIndex(1)
    const selectedTab = await tabHarness[1].isSelected();
    expect(selectedTab).toBe(true);
  });

  it('should load harness for tab-group with selected tab label', async () => {
    const tabGroups = await loader.getAllHarnesses(
      MatTabGroupHarness.with({
        selectedTabLabel: 'Report BP',
      }),
    );
    expect(tabGroups.length).toBe(1);
  });

  it('should be able to get tabs of tab-group', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabs = await tabGroup.getTabs();
    expect(tabs.length).toBe(2);
  });

  it('should be able to select tab from tab-group', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('Report BP');
    await tabGroup.selectTab({ label: 'See prior BPs' });
    expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('See prior BPs');
  });
});
