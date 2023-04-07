import { NgDocDependencies } from '@ng-doc/core';
import { DataLayerBrowserDemoModule } from './ng-doc.module';
import { DataLayerBrowserDemoComponent } from './demo/data-layer-browser-demo.component';

const PageDependencies: NgDocDependencies = {
  // Add your demos that you are going to use in the page here
  module: DataLayerBrowserDemoModule,
  demo: { DataLayerBrowserDemoComponent },
};

export default PageDependencies;
