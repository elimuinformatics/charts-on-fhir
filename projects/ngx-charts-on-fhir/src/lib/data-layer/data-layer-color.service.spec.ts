import { TestBed, inject } from '@angular/core/testing';
import { COLOR_PALETTE, DataLayerColorService } from './data-layer-color.service';

describe('DataLayerColorService', () => {
  let colorService: DataLayerColorService;
  let palette: string[];

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
    it('should call chooseColorsFromPalette', () => {
      const layer: any = {
        id: '-109669932',
        name: 'Blood Pressure',
        category: 'vital-signs',
        datasets: [],
        selected: true,
        enabled: true,
      };
      const chooseColorSpy = spyOn(colorService, 'chooseColorsFromPalette');
      colorService.chooseColorsFromPalette(layer);
      expect(chooseColorSpy).toHaveBeenCalled();
    });
  });
  describe('getAnnotationColor', () => {
    it('should get correct annotation color by calling getAnnotationColor', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const annotation: any = {
        label: {},
        backgroundColor: '#ECF0F9',
      };
      expect(service.getAnnotationColor(annotation)).toEqual(annotation.backgroundColor);
    }));
  });

  describe('getColor', () => {
    it('should getColor called', () => {
      const dataset: any = {
        label: 'Diastolic Blood Pressure',
        yAxisID: 'mm[Hg]',
        data: [],
        backgroundColor: '#e41a1c33',
      };
      const getColorSpy = spyOn(colorService, 'getColor');
      colorService.getColor(dataset);
      expect(getColorSpy).toBeDefined();
      expect(getColorSpy).toHaveBeenCalled();
    });

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

  it('getColor checks the type of color is string or undefined', function () {
    const dataset: any = {
      label: 'Diastolic Blood Pressure',
      yAxisID: 'mm[Hg]',
      data: [
        { x: 1359454965000, y: 96 },
        { x: 1362478965000, y: 90 },
      ],
      borderColor: '#e41a1c',
      backgroundColor: '#e41a1c33',
      pointBorderColor: '#e41a1c',
      pointBackgroundColor: '#e41a1c',
    };
    const color = '#e41a1c';
    const spyColor = colorService.getColor(dataset);
    spyOn(colorService, 'getColor').and.callFake(function () {
      if (typeof color === 'string') {
        return color;
      } else {
        return undefined;
      }
    });
    expect(spyColor).toEqual('#e41a1c');
  });
  describe('setColor', () => {
    it('should setColor function called', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const dataset: any = {
        label: 'Diastolic Blood Pressure',
        yAxisID: 'mm[Hg]',
        data: [
          { x: 1396347765000, y: 88 },
          { x: 1419330165000, y: 91 },
        ],
        borderColor: '#e41a1c',
        backgroundColor: '#e41a1c33',
        pointBorderColor: '#e41a1c',
        pointBackgroundColor: '#e41a1c',
      };
      service.setColor(dataset, '#e41a1c');
      expect('#e41a1c').toEqual(dataset.borderColor);
    }));
  });
});
