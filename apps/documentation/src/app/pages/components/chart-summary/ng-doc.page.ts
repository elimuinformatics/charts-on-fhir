import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { ChartSummaryDemoModule } from './ng-doc.module';
import { ChartSummaryDemoComponent } from './demo/chart-summary-demo.component';

const ChartSummary: NgDocPage = {
  title: 'Chart Summary',
  keyword: 'ChartSummary',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [ChartSummaryDemoModule],
  demos: { ChartSummaryDemoComponent },
};

export default ChartSummary;
