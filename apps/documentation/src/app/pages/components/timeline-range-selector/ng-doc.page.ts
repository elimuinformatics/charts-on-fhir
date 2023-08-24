import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { TimelineRangeSelectorDemoModule } from './ng-doc.module';
import { TimelineRangeSelectorDemoComponent } from './demo/timeline-range-selector-demo.component';

const TimelineRangeSelector: NgDocPage = {
  title: 'Timeline Range Selector',
  keyword: 'TimelineRangeSelector',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [TimelineRangeSelectorDemoModule],
  demos: { TimelineRangeSelectorDemoComponent },
};

export default TimelineRangeSelector;
