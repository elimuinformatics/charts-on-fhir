import produce from 'immer';
import { DataLayer, DataLayerCollection } from './data-layer';
import { DataLayerMergeService } from './data-layer-merge.service';

describe('DataLayerMergeService', () => {
  let service: DataLayerMergeService;

  beforeEach(() => {
    service = new DataLayerMergeService();
  });

  it('should not modify the original collection', () => {
    const collection: DataLayerCollection = {};
    const layer: DataLayer = {
      name: 'Test',
      datasets: [],
      scale: { id: 'test' },
    };
    service.merge(collection, layer);
    expect(collection).toEqual({});
  });

  it('should add a new layer when no match is found', () => {
    let collection: DataLayerCollection = {};
    const layer1: DataLayer = {
      name: 'Test',
      datasets: [],
      scale: { id: 'test' },
    };
    const layer2: DataLayer = {
      name: 'Different',
      datasets: [],
      scale: { id: 'different' },
    };
    collection = service.merge(collection, layer1);
    collection = service.merge(collection, layer2);
    const layers = Object.values(collection);
    expect(layers.length).toBe(2);
  });

  it('should add data to the existing layer when a match is found', () => {
    let collection: DataLayerCollection = {};
    const layer1: DataLayer = {
      name: 'Test',
      datasets: [
        {
          data: [{ x: 0, y: 0 }],
        },
      ],
      scale: { id: 'test' },
    };
    const layer2: DataLayer = {
      name: 'Test',
      datasets: [
        {
          data: [{ x: 1, y: 1 }],
        },
      ],
      scale: { id: 'test' },
    };
    collection = service.merge(collection, layer1);
    collection = service.merge(collection, layer2);
    const layers = Object.values(collection);
    expect(layers.length).toBe(1);
    expect(layers[0].datasets[0].data.length).toBe(2);
  });

  it('should keep extra properties of the old layer when merging', () => {
    let collection: DataLayerCollection = {};
    const layer1: DataLayer = {
      name: 'Test',
      datasets: [
        {
          data: [{ x: 0, y: 0 }],
        },
      ],
      scale: { id: 'test' },
    };
    const layer2: DataLayer = {
      name: 'Test',
      datasets: [
        {
          data: [{ x: 1, y: 1 }],
        },
      ],
      scale: { id: 'test' },
    };
    collection = service.merge(collection, layer1);
    collection = produce(collection, (draft) => {
      Object.values(draft)[0].enabled = true;
    });
    collection = service.merge(collection, layer2);
    const layers = Object.values(collection);
    expect(layers[0].enabled).toBe(true);
  });

  it('should keep extra properties of the old dataset when merging', () => {
    let collection: DataLayerCollection = {};
    const layer1: DataLayer = {
      name: 'Test',
      datasets: [
        {
          data: [{ x: 0, y: 0 }],
        },
      ],
      scale: { id: 'test' },
    };
    const layer2: DataLayer = {
      name: 'Test',
      datasets: [
        {
          data: [{ x: 1, y: 1 }],
        },
      ],
      scale: { id: 'test' },
    };
    collection = service.merge(collection, layer1);
    collection = produce(collection, (draft) => {
      Object.values(draft)[0].datasets[0].borderColor = '#000000';
    });
    collection = service.merge(collection, layer2);
    const layers = Object.values(collection);
    expect(layers[0].datasets[0].borderColor).toBe('#000000');
  });

  it('should merge datasets with matching labels', () => {
    let collection: DataLayerCollection = {};
    const layer1: DataLayer = {
      name: 'Test',
      datasets: [
        { label: 'one', data: [{ x: 1, y: 1 }] },
        { label: 'two', data: [{ x: 2, y: 2 }] },
      ],
      scale: {id: 'test'},
    };
    const layer2: DataLayer = {
      name: 'Test',
      datasets: [
        { label: 'two', data: [{ x: 2, y: 22 }] },
        { label: 'one', data: [{ x: 1, y: 11 }] },
      ],
      scale: { id: 'test'},
    };
    collection = service.merge(collection, layer1);
    collection = service.merge(collection, layer2);
    const layers = Object.values(collection);
    expect(layers.length).toBe(1);
    expect(layers[0].datasets).toEqual(
      jasmine.arrayWithExactContents([
        {
          label: 'one',
          data: [
            { x: 1, y: 1 },
            { x: 1, y: 11 },
          ],
        },
        {
          label: 'two',
          data: [
            { x: 2, y: 2 },
            { x: 2, y: 22 },
          ],
        },
      ])
    );
  });

  it('should create a new dataset if labels dont match', () => {
    let collection: DataLayerCollection = {};
    const layer1: DataLayer = {
      name: 'Test',
      datasets: [{ label: 'one', data: [{ x: 1, y: 1 }] }],
      scale: { id: 'test'},
    };
    const layer2: DataLayer = {
      name: 'Test',
      datasets: [{ label: 'two', data: [{ x: 2, y: 2 }] }],
      scale: { id: 'test'},
    };
    collection = service.merge(collection, layer1);
    collection = service.merge(collection, layer2);
    const layers = Object.values(collection);
    expect(layers.length).toBe(1);
    expect(layers[0].datasets).toEqual(
      jasmine.arrayWithExactContents([
        {
          label: 'one',
          data: [{ x: 1, y: 1 }],
        },
        {
          label: 'two',
          data: [{ x: 2, y: 2 }],
        },
      ])
    );
  });
});
