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
  describe('getAnnotationColor', () => {
    it('should return the annotation background color', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const annotation: any = {
        label: {},
        backgroundColor: '#ECF0F933',
      };
      expect(service.getAnnotationColor(annotation)).toEqual(annotation.backgroundColor);
    }));
  });

  describe('getColor', () => {
    it('should get correct annotation color by calling getColor', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const dataset: any = {
        label: 'Diastolic Blood Pressure',
        yAxisID: 'mm[Hg]',
        data: [],
        borderColor: '#e41a1c',
        backgroundColor: '#e41a1c33',
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

  describe('setAnnotationColor', () => {
    it('should set annotation color when setAnnotationColor function called', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const dataset: any = { backgroundColor: '#e41a1c33' };
      service.setAnnotationColor(dataset, '#e41a1c');
      expect(dataset.backgroundColor).toEqual('#e41a1c33');
    }));
  });
});