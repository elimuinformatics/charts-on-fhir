import { BarElement, ChartType, Tooltip, TooltipModel } from 'chart.js';
import { ActiveElement } from 'chart.js/dist/plugins/plugin.tooltip';
import './center-tooltip-positioner';

describe('Tooltip.positioners.center', () => {
  it('should return center point of floating bar', () => {
    const elements: ActiveElement[] = [
      {
        element: new BarElement({ x: 100, y: 50, width: 50, height: 10 }),
        datasetIndex: 0,
        index: 0,
      },
    ];
    const tooltipModel = {
      chart: {
        chartArea: { width: 500, height: 500 },
      },
    } as TooltipModel<ChartType>;
    const position = Tooltip.positioners.center.apply(tooltipModel, [elements, { x: 50, y: 50 }]);
    expect(position).toEqual(
      jasmine.objectContaining({
        x: 75,
        y: 50,
      })
    );
  });

  it('should return coordinates of point element', () => {
    const elements: ActiveElement[] = [
      {
        element: new BarElement({ x: 100, y: 50 }),
        datasetIndex: 0,
        index: 0,
      },
    ];
    const tooltipModel = {
      chart: {
        chartArea: { width: 500, height: 500 },
      },
    } as TooltipModel<ChartType>;
    const position = Tooltip.positioners.center.apply(tooltipModel, [elements, { x: 100, y: 50 }]);
    expect(position).toEqual(
      jasmine.objectContaining({
        x: 100,
        y: 50,
      })
    );
  });

  it('should return yAlign top if bar is in the top half of the chart', () => {
    const elements: ActiveElement[] = [
      {
        element: new BarElement({ x: 100, y: 50, width: 50, height: 10 }),
        datasetIndex: 0,
        index: 0,
      },
    ];
    const tooltipModel = {
      chart: {
        chartArea: { width: 500, height: 500 },
      },
    } as TooltipModel<ChartType>;
    const position = Tooltip.positioners.center.apply(tooltipModel, [elements, { x: 50, y: 50 }]);
    expect(position).toEqual(
      jasmine.objectContaining({
        yAlign: 'top',
      })
    );
  });

  it('should return yAlign bottom if bar is in the bottom half of the chart', () => {
    const elements: ActiveElement[] = [
      {
        element: new BarElement({ x: 100, y: 450, width: 50, height: 10 }),
        datasetIndex: 0,
        index: 0,
      },
    ];
    const tooltipModel = {
      chart: {
        chartArea: { width: 500, height: 500 },
      },
    } as TooltipModel<ChartType>;
    const position = Tooltip.positioners.center.apply(tooltipModel, [elements, { x: 50, y: 450 }]);
    expect(position).toEqual(
      jasmine.objectContaining({
        yAlign: 'bottom',
      })
    );
  });
});
