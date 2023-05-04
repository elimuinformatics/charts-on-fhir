import { DataLayerManagerService } from './data-layer-manager.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { DataLayerColorService } from './data-layer-color.service';
import { ManagedDataLayer } from './data-layer';
import { FhirChartTagsService } from '../fhir-chart-legend/fhir-chart-tags-legend/fhir-chart-tags.service';

describe('DataLayerManagerService', () => {
  let mergeService: jasmine.SpyObj<DataLayerMergeService>;
  let colorService: jasmine.SpyObj<DataLayerColorService>;
  let tagsService: jasmine.SpyObj<FhirChartTagsService>;
  // DataLayers
  const a: ManagedDataLayer = { name: 'a', id: 'a', datasets: [], scale: { id: 'a' } };
  const b: ManagedDataLayer = { name: 'b', id: 'b', datasets: [], scale: { id: 'b' } };
  const c: ManagedDataLayer = { name: 'c', id: 'c', datasets: [], scale: { id: 'c' } };

  beforeEach(() => {
    // fake mergeService adds layers without modifying them and overwrites layers with same name
    mergeService = jasmine.createSpyObj('DataLayerMergeService', ['merge']);
    mergeService.merge.and.callFake((collection, layer) => ({ ...collection, [layer.name]: { ...layer } as any }));
    // fake colorService sets borderColor because we can't use toHaveBeenCalledWith() for functions that are called with an immer draft
    colorService = jasmine.createSpyObj('DataLayerColorService', ['chooseColorsFromPalette', 'reset']);
    colorService.chooseColorsFromPalette.and.callFake((l) => l.datasets.forEach((d) => (d.borderColor = '#000000')));
    // fake tagsService does nothing
    tagsService = jasmine.createSpyObj('DatasetTagsService', ['applyTagStyles']);
  });

  describe('retrieveAll', () => {
    it('should emit allLayers$ as each layer is retrieved', () => {
      const services = [
        { name: 'one', retrieve: () => cold('a-c|', { a, c }) },
        { name: 'two', retrieve: () => cold('-b|', { b }) },
      ];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      expect(manager.allLayers$).toBeObservable(
        hot('xyz', {
          x: jasmine.arrayWithExactContents([a]),
          y: jasmine.arrayWithExactContents([a, b]),
          z: jasmine.arrayWithExactContents([a, b, c]),
        })
      );
    });

    it('should not change selectedLayers$ when a new layer is retrieved', () => {
      const services = [{ name: 'one', retrieve: () => cold('a-b|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy-', {
          x: [],
          y: [jasmine.objectContaining(a)],
        })
      );
    });
  });

  describe('autoSelect', () => {
    it('should select all layers when true', () => {
      const services = [{ name: 'one', retrieve: () => cold('ab|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(true);
      manager.retrieveAll();
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [jasmine.objectContaining(a)],
          y: [jasmine.objectContaining(a), jasmine.objectContaining(b)],
        })
      );
    });

    it('should select no layers when false', () => {
      const services = [{ name: 'one', retrieve: () => cold('ab|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(false);
      manager.retrieveAll();
      expect(manager.selectedLayers$).toBeObservable(
        hot('x', {
          x: [],
        })
      );
    });

    it('should select layer when callback returns true', () => {
      const services = [{ name: 'one', retrieve: () => cold('ab|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect((layer) => layer.name === 'a');
      manager.retrieveAll();
      expect(manager.selectedLayers$).toBeObservable(
        hot('x', {
          x: [jasmine.objectContaining(a)],
        })
      );
    });
  });

  describe('autoEnable', () => {
    it('should enable all layers when true', () => {
      const services = [{ name: 'one', retrieve: () => cold('ab|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(true);
      manager.autoEnable(true);
      manager.retrieveAll();
      expect(manager.enabledLayers$).toBeObservable(
        hot('xy', {
          x: [jasmine.objectContaining({ name: 'a', enabled: true })],
          y: [jasmine.objectContaining({ name: 'a', enabled: true }), jasmine.objectContaining({ name: 'b', enabled: true })],
        })
      );
    });

    it('should disable all layers when false', () => {
      const services = [{ name: 'one', retrieve: () => cold('ab|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(true);
      manager.autoEnable(false);
      manager.retrieveAll();
      expect(manager.enabledLayers$).toBeObservable(
        hot('x', {
          x: [],
        })
      );
    });

    it('should disable layer when callback returns false', () => {
      const services = [
        { name: 'one', retrieve: () => cold('c-b|', { c, b }) },
        { name: 'two', retrieve: () => cold('-a|', { a }) },
      ];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(true);
      manager.autoEnable((layer) => layer.name !== 'a');
      manager.retrieveAll();
      expect(manager.selectedLayers$).toBeObservable(
        hot('xyz', {
          x: [jasmine.objectContaining(c)],
          y: jasmine.arrayWithExactContents([jasmine.objectContaining({ name: 'a', enabled: false }), jasmine.objectContaining(c)]),
          z: jasmine.arrayWithExactContents([
            jasmine.objectContaining({ name: 'a', enabled: false }),
            jasmine.objectContaining(b),
            jasmine.objectContaining(c),
          ]),
        })
      );
    });
  });

  describe('autoSort', () => {
    it('should sort selectedLayers$', () => {
      const services = [
        { name: 'one', retrieve: () => cold('c-b|', { c, b }) },
        { name: 'two', retrieve: () => cold('-a|', { a }) },
      ];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(true);
      manager.autoSort((one, two) => one.name.localeCompare(two.name));
      manager.retrieveAll();
      expect(manager.selectedLayers$).toBeObservable(
        hot('xyz', {
          x: [jasmine.objectContaining(c)],
          y: [jasmine.objectContaining(a), jasmine.objectContaining(c)],
          z: [jasmine.objectContaining(a), jasmine.objectContaining(b), jasmine.objectContaining(c)],
        })
      );
    });
  });

  describe('select', () => {
    it('should emit selectedLayers$', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [],
          y: [jasmine.objectContaining(a)],
        })
      );
    });

    it('should turn off autoSelect', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(() => false);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoSelect: true }),
          y: jasmine.objectContaining({ isAutoSelect: false }),
        })
      );
    });

    it('should enable the layer', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [],
          y: [jasmine.objectContaining({ ...a, enabled: true })],
        })
      );
    });

    it('should set layer color', () => {
      const layer: ManagedDataLayer = { name: 'a', id: 'a', datasets: [{ data: [] }], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: layer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [],
          y: [
            jasmine.objectContaining({
              ...a,
              datasets: [jasmine.objectContaining({ borderColor: '#000000' })],
            }),
          ],
        })
      );
    });

    it('should throw an error if layer is already selected', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().flush();
      manager.select('a');
      expect(() => manager.select('a')).toThrowError(/already selected/);
    });

    it('should throw an error if layer does not exist', () => {
      const manager = new DataLayerManagerService([], colorService, tagsService, mergeService);
      expect(() => manager.select('a')).toThrowError(/not found/);
    });
  });

  describe('remove', () => {
    it('should remove the layer from selectedLayers$', () => {
      const services = [{ name: 'one', retrieve: () => cold('(ab|)', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 0);
      getTestScheduler().schedule(() => manager.select('b'), 0);
      getTestScheduler().schedule(() => manager.remove('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('yz', {
          x: [],
          y: [jasmine.objectContaining(a), jasmine.objectContaining(b)],
          z: [jasmine.objectContaining(b)],
        })
      );
    });

    it('should turn off autoSelect', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(() => true);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.remove('a'), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoSelect: true }),
          y: jasmine.objectContaining({ isAutoSelect: false }),
        })
      );
    });

    it('should throw an error if layer is not selected', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().flush();
      expect(() => manager.remove('a')).toThrowError(/not selected/);
    });
  });

  describe('enable', () => {
    it('should enable the layer in allLayers$', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.enable('a'), 10);
      expect(manager.allLayers$).toBeObservable(
        hot('xy', {
          x: [a],
          y: [jasmine.objectContaining({ id: 'a', enabled: true })],
        })
      );
    });

    it('should turn off autoEnable', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoEnable(() => false);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.enable('a'), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoEnable: true }),
          y: jasmine.objectContaining({ isAutoEnable: false }),
        })
      );
    });

    it('should show datasets for the layer in allLayers$', () => {
      const layer: ManagedDataLayer = { name: 'a', id: 'a', datasets: [{ data: [] }], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: layer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.enable('a'), 10);
      expect(manager.allLayers$).toBeObservable(
        hot('xy', {
          x: [layer],
          y: [jasmine.objectContaining({ id: 'a', datasets: [jasmine.objectContaining({ hidden: false })] })],
        })
      );
    });

    it('should disable the layer in selectedLayers$ when enabled=false', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      getTestScheduler().schedule(() => manager.enable('a', false), 20);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xyz', {
          x: [],
          y: [jasmine.objectContaining({ id: 'a', enabled: true })],
          z: [jasmine.objectContaining({ id: 'a', enabled: false })],
        })
      );
    });

    it('should hide datasets for the layer in selectedLayers$ when enabled=false', () => {
      const layer: ManagedDataLayer = { name: 'a', id: 'a', datasets: [{ data: [] }], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: layer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      getTestScheduler().schedule(() => manager.enable('a', false), 20);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xyz', {
          x: [],
          y: [jasmine.objectContaining({ id: 'a' })],
          z: [jasmine.objectContaining({ id: 'a', datasets: [jasmine.objectContaining({ hidden: true })] })],
        })
      );
    });

    it('should throw an error if layer does not exist', () => {
      const manager = new DataLayerManagerService([], colorService, tagsService, mergeService);
      expect(() => manager.enable('a')).toThrowError(/not found/);
    });
  });

  describe('update', () => {
    it('should emit updated layer in allLayers$', () => {
      const updatedLayer = { name: 'updated', id: 'a', datasets: [], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.update(updatedLayer), 10);
      expect(manager.allLayers$).toBeObservable(
        hot('xy', {
          x: [a],
          y: [jasmine.objectContaining({ id: 'a', name: 'updated' })],
        })
      );
    });

    it('should throw an error if layer does not exist', () => {
      const manager = new DataLayerManagerService([], colorService, tagsService, mergeService);
      expect(() => manager.enable('a')).toThrowError(/not found/);
    });

    it('should turn off autoEnable when a dataset is hidden', () => {
      const originalLayer = { name: 'a', id: 'a', datasets: [{ label: 'aa', data: [], hidden: false }], scale: { id: 'a' } };
      const updatedLayer = { name: 'a', id: 'a', datasets: [{ label: 'aa', data: [], hidden: true }], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: originalLayer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoEnable(() => true);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.update(updatedLayer), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoEnable: true }),
          y: jasmine.objectContaining({ isAutoEnable: false }),
        })
      );
    });

    it('should turn off autoEnable when a layer is disabled', () => {
      const originalLayer = { name: 'a', id: 'a', enabled: true, datasets: [], scale: { id: 'a' } };
      const updatedLayer = { name: 'a', id: 'a', enabled: false, datasets: [], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: originalLayer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoEnable(() => true);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.update(updatedLayer), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoEnable: true }),
          y: jasmine.objectContaining({ isAutoEnable: false }),
        })
      );
    });

    it('should turn off autoSelect when a layer is removed', () => {
      const originalLayer = { name: 'a', id: 'a', selected: true, datasets: [], scale: { id: 'a' } };
      const updatedLayer = { name: 'a', id: 'a', selected: false, datasets: [], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: originalLayer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(() => true);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.update(updatedLayer), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoSelect: true }),
          y: jasmine.objectContaining({ isAutoSelect: false }),
        })
      );
    });

    it('should add layer to selectedLayers when selected=true', () => {
      const originalLayer = { name: 'a', id: 'a', selected: false, datasets: [], scale: { id: 'a' } };
      const updatedLayer = { name: 'a', id: 'a', selected: true, datasets: [], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: originalLayer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.update(updatedLayer), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [],
          y: [jasmine.objectContaining({ name: 'a', selected: true })],
        })
      );
    });

    it('should remove layer from selectedLayers when selected=false', () => {
      const originalLayer = { name: 'a', id: 'a', selected: true, datasets: [], scale: { id: 'a' } };
      const updatedLayer = { name: 'a', id: 'a', selected: false, datasets: [], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: originalLayer }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSelect(() => true);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.update(updatedLayer), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [jasmine.objectContaining({ name: 'a', selected: true })],
          y: [],
        })
      );
    });
  });

  describe('move', () => {
    it('should emit selectedLayers$ in new order', () => {
      const services = [{ name: 'one', retrieve: () => cold('(abc|)', { a, b, c }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 0);
      getTestScheduler().schedule(() => manager.select('b'), 0);
      getTestScheduler().schedule(() => manager.select('c'), 0);
      getTestScheduler().schedule(() => manager.move(0, 2), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [jasmine.objectContaining(a), jasmine.objectContaining(b), jasmine.objectContaining(c)],
          y: [jasmine.objectContaining(b), jasmine.objectContaining(c), jasmine.objectContaining(a)],
        })
      );
    });

    it('should turn off autoSort', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, tagsService, mergeService);
      manager.autoSort(() => 0);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.move(0, 0), 10);
      expect(manager.settings$).toBeObservable(
        hot('xy', {
          x: jasmine.objectContaining({ isAutoSort: true }),
          y: jasmine.objectContaining({ isAutoSort: false }),
        })
      );
    });

    it('should throw an error if previousIndex is invalid', () => {
      const manager = new DataLayerManagerService([], colorService, tagsService, mergeService);
      expect(() => manager.move(1, 0)).toThrowError(/out of range/);
    });
  });
});
