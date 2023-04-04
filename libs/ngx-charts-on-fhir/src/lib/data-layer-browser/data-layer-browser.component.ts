import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { sum } from 'lodash-es';
import { DataLayer } from '../data-layer/data-layer';
import { DataLayerManagerService } from '../data-layer/data-layer-manager.service';

@Component({
  selector: 'data-layer-browser',
  templateUrl: './data-layer-browser.component.html',
  styleUrls: ['./data-layer-browser.component.css'],
})
export class DataLayerBrowserComponent implements OnInit, AfterViewInit {
  @Output() addLayer = new EventEmitter<DataLayer>();

  constructor(readonly layerManager: DataLayerManagerService) {}

  dataSource = new MatTableDataSource<DataLayer>();
  displayedColumns = ['add', 'name', 'category', 'datapoints'];
  filterControl = new FormControl('');

  @ViewChild(MatSort) sort?: MatSort;

  getLayerId = (index: number, layer: DataLayer) => layer.name;
  getDatasetCount = (layer: DataLayer) => layer.datasets.length;
  getDatapointCount = (layer: DataLayer) => sum(layer.datasets.map((dataset) => dataset.data.length));
  getCategory = (layer: DataLayer) => layer.category?.join(', ') ?? '';
  ngOnInit(): void {
    this.layerManager.availableLayers$.subscribe((layers) => (this.dataSource.data = layers));
    this.dataSource.filterPredicate = (layer, filter) =>
      layer.name.toLowerCase().includes(filter) ||
      layer.category?.some((category) => category.toLowerCase().includes(filter)) ||
      layer.datasets.some((dataset) => dataset.label?.toLowerCase().includes(filter));
    this.filterControl.valueChanges.subscribe((value) => (this.dataSource.filter = value?.trim().toLowerCase() ?? ''));
  }
  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'datapoints') {
          return this.getDatapointCount(item);
        } else if (property === 'category') {
          return this.getCategory(item);
        }
        return String(item[property as keyof typeof item]);
      };
      this.dataSource.sort = this.sort;
    }
  }
}
