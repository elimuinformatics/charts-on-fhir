import { TestBed, inject } from '@angular/core/testing';
import { COLOR_PALETTE, DataLayerColorService } from './data-layer-color.service';

describe('DataLayerColorService', () => {
  let colorService: DataLayerColorService;
  let palette: string[] = ['#000000', '#ffffff'];

  beforeEach(async () => {
    colorService = new DataLayerColorService(palette);
    await TestBed.configureTestingModule({
      providers: [
        { provide: DataLayerColorService, useValue: colorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();
  });

  describe('chooseColorsFromPalette', () => {
    it('should always choose the same color for a dataset', () => {
      const service1 = new DataLayerColorService(palette);
      const service2 = new DataLayerColorService(palette);
      const layer1: any = {
        datasets: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }],
        annotations: [{ label: { display: true } }],
      };
      const layer2: any = {
        datasets: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }],
        annotations: [{ label: { display: true } }],
      };
      service1.chooseColorsFromPalette(layer1);
      service2.chooseColorsFromPalette(layer2);
      expect(layer1.datasets[0].borderColor).toEqual(layer2.datasets[0].borderColor);
      expect(layer1.datasets[1].borderColor).toEqual(layer2.datasets[1].borderColor);
      expect(layer1.datasets[2].borderColor).toEqual(layer2.datasets[2].borderColor);
    });

    it('should reuse color from matching dataset', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [
          {
            label: 'One',
            chartsOnFhir: {
              group: 'One',
            },
          },
          {
            label: 'One (X)',
            chartsOnFhir: {
              group: 'One',
            },
          },
        ],
        annotations: [{ label: { display: true, content: 'One Annotation' } }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].borderColor).toEqual(palette[0]);
      expect(layer.datasets[1].borderColor).toEqual(palette[0]);
    }));

    it('should brighten palette color by 20% for home measurements', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [
          {
            label: 'One (Home)',
            chartsOnFhir: {
              colorPalette: 'light',
            },
          },
        ],
        annotations: [{ label: { display: true } }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].borderColor).toEqual('#333333');
    }));

    it('should add transparency for matching annotation color', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [
          {
            label: 'One',
            chartsOnFhir: {
              group: 'One',
              colorPalette: 'dark',
              tags: ['Clinic'],
            },
          },
        ],
        annotations: [{ label: { display: true, content: 'One Annotation' } }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.annotations[0].backgroundColor).toEqual('rgba(0, 0, 0, 0.2)');
    }));

    it('should ignore datasets that use a callback function for borderColor', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const borderColor = () => '#000000';
      const layer: any = {
        datasets: [{ label: 'One', borderColor }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].borderColor).toBe(borderColor);
    }));
    it('should ignore datasets that use a callback function for pointBackgroundColor', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const pointBackgroundColor = () => '#000000';
      const layer: any = {
        datasets: [{ label: 'One', pointBackgroundColor }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].pointBackgroundColor).toBe(pointBackgroundColor);
    }));
  });

  describe('addTransparency', () => {
    it('should add transparency for abritrary color', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const color = '#ECF0F9';
      expect(service.addTransparency(color)).toEqual('rgba(236, 240, 249, 0.2)');
    }));
  });

  describe('getColor', () => {
    it('should get the borderColor of a dataset', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const dataset: any = {
        label: 'Diastolic Blood Pressure',
        yAxisID: 'mm[Hg]',
        data: [],
        borderColor: '#e41a1c',
      };
      expect(service.getColor(dataset)).toEqual(dataset.borderColor);
    }));
  });

  describe('setColor', () => {
    it('should set the borderColor of a dataset', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const dataset: any = { borderColor: '#e41a1c' };
      service.setColor(dataset, '#e41a1c');
      expect(dataset.borderColor).toEqual('#e41a1c');
    }));
  });
});
