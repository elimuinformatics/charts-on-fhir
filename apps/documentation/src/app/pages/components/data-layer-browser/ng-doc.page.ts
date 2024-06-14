import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { DataLayerBrowserDemoComponent } from './demo/data-layer-browser-demo.component';

const DataLayerBrowser: NgDocPage = {
  title: 'Data Layer Browser',
  keyword: 'DataLayerBrowser',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { DataLayerBrowserDemoComponent },
};

export default DataLayerBrowser;
