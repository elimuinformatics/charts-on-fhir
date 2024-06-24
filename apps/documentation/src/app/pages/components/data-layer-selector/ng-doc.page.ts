import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { DataLayerSelectorDemoComponent } from './demo/data-layer-selector-demo.component';

const DataLayerSelector: NgDocPage = {
  title: 'Data Layer Selector',
  keyword: 'DataLayerSelector',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { DataLayerSelectorDemoComponent },
};

export default DataLayerSelector;
