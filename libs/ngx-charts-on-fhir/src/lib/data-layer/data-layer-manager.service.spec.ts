import { DataLayerManagerService } from './data-layer-manager.service';
import { DataLayerMergeService } from './data-layer-merge.service';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { DataLayerColorService } from './data-layer-color.service';
import { ManagedDataLayer } from './data-layer';

describe('DataLayerManagerService', () => {
  let mergeService: jasmine.SpyObj<DataLayerMergeService>;
  let colorService: jasmine.SpyObj<DataLayerColorService>;

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
  });

  describe('retrieveAll', () => {
    it('should emit allLayers$ as each layer is retrieved', () => {
      const services = [
        { name: 'one', retrieve: () => cold('a-c|', { a, c }) },
        { name: 'two', retrieve: () => cold('-b|', { b }) },
      ];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy-', {
          x: [],
          y: [jasmine.objectContaining(a)],
        })
      );
    });

    it('should select layers automatically when selectAll=true', () => {
      const services = [{ name: 'one', retrieve: () => cold('ab|', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll(true);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [jasmine.objectContaining(a)],
          y: [jasmine.objectContaining(a), jasmine.objectContaining(b)],
        })
      );
    });

    it('should sort selectedLayers$ when auto-selecting', () => {
      const services = [
        { name: 'one', retrieve: () => cold('c-b|', { c, b }) },
        { name: 'two', retrieve: () => cold('-a|', { a }) },
      ];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll(true, (one, two) => one.name.localeCompare(two.name));
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
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.select('a'), 10);
      expect(manager.selectedLayers$).toBeObservable(
        hot('xy', {
          x: [],
          y: [jasmine.objectContaining(a)],
        })
      );
    });

    it('should enable the layer', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll();
      getTestScheduler().flush();
      manager.select('a');
      expect(() => manager.select('a')).toThrowError(/already selected/);
    });

    it('should throw an error if layer does not exist', () => {
      const manager = new DataLayerManagerService([], colorService, mergeService);
      expect(() => manager.select('a')).toThrowError(/not found/);
    });
  });

  describe('remove', () => {
    it('should remove the layer from selectedLayers$', () => {
      const services = [{ name: 'one', retrieve: () => cold('(ab|)', { a, b }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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

    it('should throw an error if layer is not selected', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll();
      getTestScheduler().flush();
      expect(() => manager.remove('a')).toThrowError(/not selected/);
    });
  });

  describe('enable', () => {
    it('should enable the layer in allLayers$', () => {
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
      manager.retrieveAll();
      getTestScheduler().schedule(() => manager.enable('a'), 10);
      expect(manager.allLayers$).toBeObservable(
        hot('xy', {
          x: [a],
          y: [jasmine.objectContaining({ id: 'a', enabled: true })],
        })
      );
    });

    it('should show datasets for the layer in allLayers$', () => {
      const layer: ManagedDataLayer = { name: 'a', id: 'a', datasets: [{ data: [] }], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a: layer }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService([], colorService, mergeService);
      expect(() => manager.enable('a')).toThrowError(/not found/);
    });
  });

  describe('update', () => {
    it('should emit updated layer in allLayers$', () => {
      const updatedLayer = { name: 'updated', id: 'a', datasets: [], scale: { id: 'a' } };
      const services = [{ name: 'one', retrieve: () => cold('a|', { a }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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
      const manager = new DataLayerManagerService([], colorService, mergeService);
      expect(() => manager.enable('a')).toThrowError(/not found/);
    });
  });

  describe('move', () => {
    it('should emit selectedLayers$ in new order', () => {
      const services = [{ name: 'one', retrieve: () => cold('(abc|)', { a, b, c }) }];
      const manager = new DataLayerManagerService(services, colorService, mergeService);
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

    it('should throw an error if previousIndex is invalid', () => {
      const manager = new DataLayerManagerService([], colorService, mergeService);
      expect(() => manager.move(1, 0)).toThrowError(/out of range/);
    });
  });
});