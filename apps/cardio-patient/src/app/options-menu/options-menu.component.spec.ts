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

  it('should emit legendChange when checked', async () => {
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    const childLoader = await menu.getChildLoader('*');
    const legendToggle = await childLoader.getHarness(MatSlideToggleHarness);
    expect(await legendToggle.isChecked()).toBe(false);
    let emitted: boolean;
    component.legendChange.subscribe((e) => (emitted = e));
    await legendToggle.check();
    expect(emitted!).toBe(true);
  });

  it('should emit legendChange when unchecked', async () => {
    component.legend = true;
    const menu = await loader.getHarness(MatMenuHarness);
    await menu.open();
    const childLoader = await menu.getChildLoader('*');
    const legendToggle = await childLoader.getHarness(MatSlideToggleHarness);
    expect(await legendToggle.isChecked()).toBe(true);
    let emitted: boolean;
    component.legendChange.subscribe((e) => (emitted = e));
    await legendToggle.uncheck();
    expect(emitted!).toBe(false);
  });
});
