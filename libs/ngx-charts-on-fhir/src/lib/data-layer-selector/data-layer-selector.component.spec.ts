import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataLayerSelectorComponent } from './data-layer-selector.component';
import { DataLayerSelectorModule } from './data-layer-selector.module';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

describe('DataLayerSelectorComponent', () => {
  let component: DataLayerSelectorComponent;
  let fixture: ComponentFixture<DataLayerSelectorComponent>;
  let loader: HarnessLoader;
  let layerManager: jasmine.SpyObj<DataLayerManagerService>;
  let layerManagerSettings$: Subject<any>;

  beforeEach(async () => {
    layerManagerSettings$ = new Subject();
    layerManager = jasmine.createSpyObj<DataLayerManagerService>('DataLayerManagerService', ['autoSelect', 'autoEnable', 'autoSort'], {
      settings$: layerManagerSettings$,
    });
    await TestBed.configureTestingModule({
      imports: [DataLayerSelectorModule, NoopAnimationsModule],
      providers: [{ provide: DataLayerManagerService, useValue: layerManager }],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerSelectorComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render an option for each view', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: [], enabled: [] },
      two: { selected: [], enabled: [] },
    });
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('one');
    expect(await options[1].getText()).toBe('two');
  });

  it('should change views when active input changes', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: [] },
    });
    fixture.componentRef.setInput('active', 'one');
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.getValueText()).toBe('one');
  });

  it('should change active property when selection changes', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: [] },
    });
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: 'one' });
    expect(component.active).toBe('one');
  });

  it('should set autoSelect for the selected view', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: [] },
    });
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: 'one' });
    expect(layerManager.autoSelect).toHaveBeenCalledTimes(1);
    const callback = layerManager.autoSelect.calls.argsFor(0)[0] as (layer: { name: string }) => boolean;
    expect(callback({ name: 'a' })).toBe(true);
    expect(callback({ name: 'b' })).toBe(true);
    expect(callback({ name: 'c' })).toBe(false);
  });

  it('should set autoEnable for the selected view', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: ['a'] },
    });
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: 'one' });
    expect(layerManager.autoEnable).toHaveBeenCalledTimes(1);
    const callback = layerManager.autoEnable.calls.argsFor(0)[0] as (layer: { name: string }) => boolean;
    expect(callback({ name: 'a' })).toBe(true);
    expect(callback({ name: 'b' })).toBe(false);
    expect(callback({ name: 'c' })).toBe(false);
  });

  it('should autoSort by enabled list', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: ['b', 'a'] },
    });
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: 'one' });
    expect(layerManager.autoSort).toHaveBeenCalledTimes(1);
    const callback = layerManager.autoSort.calls.argsFor(0)[0] as (a: { name: string }, b: { name: string }) => number;
    expect(callback({ name: 'a' }, { name: 'b' })).toBeGreaterThan(0);
  });

  it('should autoSort by selected list if item is not in enabled list', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: ['a'] },
    });
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: 'one' });
    expect(layerManager.autoSort).toHaveBeenCalledTimes(1);
    const callback = layerManager.autoSort.calls.argsFor(0)[0] as (a: { name: string }, b: { name: string }) => number;
    expect(callback({ name: 'a' }, { name: 'b' })).toBeLessThan(0);
  });

  it('should display "Custom" when a layer is manually enabled', async () => {
    fixture.componentRef.setInput('views', {
      one: { selected: ['a', 'b'], enabled: ['a'] },
    });
    fixture.componentRef.setInput('active', 'one');
    fixture.detectChanges();
    layerManagerSettings$.next({ isAutoSelect: true, isAutoEnable: false, isAutoSort: true });
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.getValueText()).toBe('Custom');
    expect(component.active).toBeUndefined();
  });
});
