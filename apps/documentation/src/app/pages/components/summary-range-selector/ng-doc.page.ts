import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { SummaryRangeSelectorDemoComponent } from './demo/summary-range-selector-demo.component';

const SummaryRangeSelector: NgDocPage = {
  title: 'Summary Range Selector',
  keyword: 'SummaryRangeSelector',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { SummaryRangeSelectorDemoComponent },
};

export default SummaryRangeSelector;
