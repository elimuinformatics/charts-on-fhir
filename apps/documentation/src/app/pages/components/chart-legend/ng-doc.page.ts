import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { ChartLegendDemoComponent } from './demos/legend/chart-legend-demo.component';
import { ChartTagsLegendDemoComponent } from './demos/tags-legend/chart-tags-legend-demo.component';

const ChartLegend: NgDocPage = {
  title: `Chart Legend`,
  mdFile: './index.md',
  keyword: `ChartLegend`,
  category: ComponentsCategory,
  imports: [],
  demos: { ChartLegendDemoComponent, ChartTagsLegendDemoComponent },
};

export default ChartLegend;
