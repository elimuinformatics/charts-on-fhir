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
    it('should cycle through the palette', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }],
        annotations: [{ label: { display: true } }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].borderColor).toEqual(palette[0]);
      expect(layer.datasets[1].borderColor).toEqual(palette[1]);
      expect(layer.datasets[2].borderColor).toEqual(palette[0]);
    }));

    it('should reuse color from matching dataset', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [{ label: 'One' }, { label: 'One (X)' }],
        annotations: [{ label: { display: true } }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].borderColor).toEqual(palette[0]);
      expect(layer.datasets[1].borderColor).toEqual(palette[1]);
    }));

    it('should brighten palette color by 20% for home measurements', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [{ label: 'One (Home)' }],
        annotations: [{ label: { display: true } }],
      };
      service.chooseColorsFromPalette(layer);
      expect(layer.datasets[0].borderColor).toEqual('#000000');
    }));

    it('should add transparency for matching annotation color', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [
          {
            label: 'One',
            chartsOnFhir: {
              colorGroup: 'One',
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
  });

  describe('addTransparency', () => {
    it('should add transparency for abritrary color', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const color = '#ECF0F9';
      expect(service.addTransparency(color)).toEqual('rgba(236, 240, 249, 0.2)');
    }));
  });

  describe('getColor', () => {
    it('should get correct annotation color by calling getColor', inject([DataLayerColorService], (service: DataLayerColorService) => {
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
    it('should setColor function called', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const dataset: any = { borderColor: '#e41a1c' };
      service.setColor(dataset, '#e41a1c');
      expect(dataset.borderColor).toEqual('#e41a1c');
    }));
  });
});
