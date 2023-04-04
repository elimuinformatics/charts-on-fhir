import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsMenuComponent } from './options-menu.component';
import { OptionsMenuModule } from './options-menu.module';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OptionsMenuComponent', () => {
  let component: OptionsMenuComponent;
  let fixture: ComponentFixture<OptionsMenuComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsMenuModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable the legend when checked', async () => {
    component.chart = { legendPosition: 'none' } as any;
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    const childLoader = await menu.getChildLoader('*');
    const legendToggle = await childLoader.getHarness(MatSlideToggleHarness);
    expect(await legendToggle.isChecked()).toBe(false);
    await legendToggle.check();
    expect(component.chart?.legendPosition).toBe('float');
  });

  it('should disable the legend when unchecked', async () => {
    component.chart = { legendPosition: 'float' } as any;
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    const childLoader = await menu.getChildLoader('*');
    const legendToggle = await childLoader.getHarness(MatSlideToggleHarness);
    expect(await legendToggle.isChecked()).toBe(true);
    await legendToggle.uncheck();
    expect(component.chart?.legendPosition).toBe('none');
  });
});
