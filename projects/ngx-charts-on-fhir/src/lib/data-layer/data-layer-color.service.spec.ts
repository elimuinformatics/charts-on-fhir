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
    it('should call setColor', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any = {
        datasets: [{ label: 'Diastolic Blood Pressure' }],
        annotations: [{ label: { display: true } }],
        backgroundColor: '#ECF0F9',
      };
      let setColorSpy = spyOn(service, 'setColor');
      service.chooseColorsFromPalette(layer);
      expect(setColorSpy).toHaveBeenCalled();
    }));
  });

  describe('addTransparency', () => {
    it('should add transparency for abritrary color', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const color = '#ECF0F9';
      expect(service.addTransparency(color)).toEqual('rgba(236, 240, 249, 0.5)');
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
