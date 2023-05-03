import { ChartType, Tooltip, TooltipPositionerFunction } from 'chart.js';

declare module 'chart.js' {
  interface TooltipPositionerMap {
    center: TooltipPositionerFunction<ChartType>;
  }
}

/**
 * Custom positioner that centers tooltip anchor point for floating bars.
 * Only supports horizontal bar charts.
 */
Tooltip.positioners.center = function (elements) {
  if (elements.length) {
    const props = elements[0].element.getProps(['width']);
    const width = Number(props['width'] ?? 0);
    const yAlign = elements[0].element.y > this.chart.chartArea.height / 2 ? 'bottom' : 'top';
    if (width) {
      // BarElement: (x,y) coordinate is at the end of the bar, vertically centered (for horizontal bar)
      return {
        x: elements[0].element.x - width / 2,
        y: elements[0].element.y,
        yAlign,
      };
    }
    // Point
    return {
      x: elements[0].element.x,
      y: elements[0].element.y,
    };
  }
  return { x: 0, y: 0 };
};
