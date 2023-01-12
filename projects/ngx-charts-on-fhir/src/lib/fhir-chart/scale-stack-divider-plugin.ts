import { Chart, Plugin, Scale, CartesianScaleOptions } from 'chart.js';
import { isCartesianScale } from '../utils';

export const scaleStackDividerPlugin: Plugin = {
  id: 'scale-stack-divider-plugin',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    for (let scale of Object.values(chart.scales)) {
      if (!scale.isHorizontal() && isCartesianScale(scale) && scale.top > chartArea.top) {
        ctx.save();
        drawDivider(chart, scale, 24, '#fff');
        drawDivider(chart, scale, 1, '#666');
        ctx.restore();
      }
    }
  },
};

function drawDivider({ ctx, chartArea }: Chart, scale: Scale<CartesianScaleOptions>, width: number, color = '#000') {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  // align to pixels
  const top = width % 2 === 0 ? Math.floor(scale.top) : Math.floor(scale.top) + 0.5;
  ctx.beginPath();
  ctx.moveTo(chartArea.left - 1, top);
  ctx.lineTo(chartArea.right, top);
  ctx.stroke();
}
