import { Chart } from 'chart.js';
import { MedicationScale } from './medication-scale';

describe('MedicationScale', () => {
  let wrapper: HTMLDivElement;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    Chart.register(MedicationScale);
    wrapper = document.createElement('div');
    canvas = document.createElement('canvas', {});
    canvas.width = 100;
    canvas.height = 100;
    wrapper.appendChild(canvas);
    document.body.appendChild(wrapper);
  });

  afterEach(() => {
    document.body.removeChild(wrapper);
    Chart.unregister(MedicationScale);
  });

  it('should register successfully', () => {
    expect(Chart.registry.getScale('medication')).toBeDefined();
  });

  it('should adjust pixel coordinates from base scale', () => {
    const chart = new Chart(canvas, {
      data: {
        datasets: [
          {
            type: 'line',
            yAxisID: 'category',
            data: [{ x: 1, y: 'a' }],
          },
          {
            type: 'line',
            yAxisID: 'medication',
            data: [{ x: 1, y: 'a' }],
          },
        ],
      },
      options: {
        scales: {
          category: {
            type: 'category',
            axis:'r'
          },
          medication: {
            type: 'medication',
            axis:'r'
          },
        },
      },
    });
    chart.update();
    const catPixel = chart.scales['category'].getPixelForValue('a' as any);
    const medPixel = chart.scales['medication'].getPixelForValue('a' as any);
    expect(medPixel).toEqual(catPixel + 30);
    chart.destroy();
  });
});
