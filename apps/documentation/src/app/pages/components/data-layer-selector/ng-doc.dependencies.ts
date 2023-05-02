import { NgDocDependencies } from '@ng-doc/core';
import { DataLayerSelectorDemoModule } from './ng-doc.module';
import { DataLayerSelectorDemoComponent } from './demo/data-layer-selector-demo.component';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: DataLayerSelectorDemoModule,
  demo: { DataLayerSelectorDemoComponent },
};

export default PageDependencies;
