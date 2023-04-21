import { Chart, ChartArea } from 'chart.js';
import { scaleStackDividerPlugin } from './scale-stack-divider-plugin';

describe('scaleStackDividerPlugin', () => {
  it('should register successfully', () => {
    Chart.register(scaleStackDividerPlugin);
    expect(Chart.registry.getPlugin('scale-stack-divider-plugin')).toBeDefined();
  });

  it('should draw a line between scales', () => {
    const ctx = jasmine.createSpyObj<CanvasRenderingContext2D>(
      'CanvasRenderingContext2D',
      ['save', 'restore', 'beginPath', 'moveTo', 'lineTo', 'stroke', 'clearRect'],
      ['strokeStyle', 'lineWidth']
    );
    const chartArea: ChartArea = {
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
    };
    const scales = {
      one: {
        isHorizontal: () => false,
        type: 'linear',
        top: 0,
      },
      two: {
        isHorizontal: () => false,
        type: 'linear',
        top: 50,
      },
    };
    const chart: any = { ctx, chartArea, scales };
    expect(scaleStackDividerPlugin.beforeDatasetsDraw).toBeDefined();
    if (scaleStackDividerPlugin.beforeDatasetsDraw) {
      scaleStackDividerPlugin.beforeDatasetsDraw(chart, { cancelable: true }, {});
    }
    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });
});
