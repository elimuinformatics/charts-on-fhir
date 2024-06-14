import { NgDocPage } from '@ng-doc/core';
import ComponentsCategory from '../ng-doc.category';
import { DataLayerListDemoComponent } from './demo/data-layer-list-demo.component';

const DataLayerList: NgDocPage = {
  title: 'Data Layer List',
  keyword: 'DataLayerList',
  category: ComponentsCategory,
  mdFile: './index.md',
  imports: [],
  demos: { DataLayerListDemoComponent },
};

export default DataLayerList;
