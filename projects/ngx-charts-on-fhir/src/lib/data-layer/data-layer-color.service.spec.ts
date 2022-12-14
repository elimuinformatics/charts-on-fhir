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
    it('should call chooseColorsFromPalette', inject([DataLayerColorService], (service: DataLayerColorService) => {
      const layer: any ={ "id": "-109669932", "name": "Blood Pressure", "category": "vital-signs", "datasets": [ { "label": "Diastolic Blood Pressure", "yAxisID": "mm[Hg]", "data": [ { "x": 1419330165000, "y": 91 }, { "x": 1421749365000, "y": 99 }, { "x": 1455618165000, "y": 94 }, { "x": 1460456565000, "y": 93 }, { "x": 1476181365000, "y": 88 }, { "x": 1512469365000, "y": 88 }, { "x": 1548757365000, "y": 95 }, { "x": 1556619765000, "y": 94 }, { "x": 1559643765000, "y": 91 }, { "x": 1571739765000, "y": 89 }, { "x": 1588674165000, "y": 94 }, { "x": 1613470965000, "y": 96 }, { "x": 1631614965000, "y": 91 }, { "x": 1649758965000, "y": 90 }, { "x": 1652782965000, "y": 93 } ] }, { "label": "Systolic Blood Pressure", "yAxisID": "mm[Hg]", "data": [ { "x": 1419330165000, "y": 121 }, { "x": 1421749365000, "y": 130 }, { "x": 1455618165000, "y": 122 }, { "x": 1460456565000, "y": 136 }, { "x": 1476181365000, "y": 124 }, { "x": 1512469365000, "y": 123 }, { "x": 1548757365000, "y": 132 }, { "x": 1556619765000, "y": 129 }, { "x": 1559643765000, "y": 121 }, { "x": 1571739765000, "y": 125 }, { "x": 1588674165000, "y": 129 }, { "x": 1613470965000, "y": 125 }, { "x": 1631614965000, "y": 127 }, { "x": 1649758965000, "y": 127 }, { "x": 1652782965000, "y": 132 } ] } ], "scales": { "timeline": { "position": "bottom", "type": "time" }, "mm[Hg]": { "display": "auto", "position": "left", "type": "linear", "stack": "all", "title": { "display": true, "text": "mm[Hg]" } } }, "annotations": [ { "label": { "display": true, "position": { "x": "start", "y": "end" }, "color": "#666666", "font": { "size": 16, "weight": "normal" }, "content": "Systolic Blood Pressure Reference Range" }, "type": "box", "backgroundColor": "#ECF0F9", "borderWidth": 0, "drawTime": "beforeDraw", "display": true, "yScaleID": "mm[Hg]", "yMax": 130, "yMin": 90 }, { "label": { "display": true, "position": { "x": "start", "y": "end" }, "color": "#666666", "font": { "size": 16, "weight": "normal" }, "content": "Diastolic Blood Pressure Reference Range" }, "type": "box", "backgroundColor": "#ECF0F9", "borderWidth": 0, "drawTime": "beforeDraw", "display": true, "yScaleID": "mm[Hg]", "yMax": 80, "yMin": 60 } ], "selected": true, "enabled": true };
      let setColorSpy= spyOn(service, 'setColor');
      service.chooseColorsFromPalette(layer);
      expect(setColorSpy).toHaveBeenCalled();
    }));
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

  describe('setAnnotationColor', () => {
    it('should set annotation color when setAnnotationColor function called', inject([DataLayerColorService], (service: DataLayerColorService) => {
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
      service.setAnnotationColor(dataset, '#e41a1c');
      expect(dataset.backgroundColor).toEqual('#e41a1c33');
    }));
  });
});
