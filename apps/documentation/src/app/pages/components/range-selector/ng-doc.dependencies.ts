import { NgDocDependencies } from '@ng-doc/core';
import { RangeSelectorDemoComponent } from './demo/range-selector-demo.component';
import { RangeSelectorDemoModule } from './ng-doc.module';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: RangeSelectorDemoModule,
  demo: { RangeSelectorDemoComponent },
};

export default PageDependencies;
