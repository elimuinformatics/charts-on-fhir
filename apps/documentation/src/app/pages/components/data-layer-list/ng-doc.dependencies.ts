import { NgDocDependencies } from '@ng-doc/core';
import { DataLayerListDemoModule } from './ng-doc.module';
import { DataLayerListDemoComponent } from './demo/data-layer-list-demo.component';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: DataLayerListDemoModule,
  demo: { DataLayerListDemoComponent },
};

export default PageDependencies;
