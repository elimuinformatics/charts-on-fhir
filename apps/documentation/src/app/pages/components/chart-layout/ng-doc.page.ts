import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { ChartLayoutDemoComponent } from './demo/chart-layout-demo.component';

const ChartLayout: NgDocPage = {
  title: 'Chart Layout',
  keyword: 'ChartLayout',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { ChartLayoutDemoComponent },
};

export default ChartLayout;
