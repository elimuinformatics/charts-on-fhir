import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { update } from 'lodash-es';
import { EMPTY } from 'rxjs';
import { DataLayer } from '../../data-layer/data-layer';
import { DataLayerColorService, COLOR_PALETTE } from '../../data-layer/data-layer-color.service';
import { DataLayerManagerService } from '../../data-layer/data-layer-manager.service';
import { DataLayerListComponent } from './data-layer-list.component';

const mockColorService = {
  getColor: () => '#000000',
  setColor: () => {},
};

const mockLayerManager = {
  selectedLayers$: EMPTY,
  timelineRange$: EMPTY,
};

@Component({ selector: 'data-layer-options', template: '' })
class MockDataLayerOptionsComponent {
  @Input() layer?: DataLayer;
}

describe('FhirDatasetsComponent', () => {
  let component: DataLayerListComponent;
  let fixture: ComponentFixture<DataLayerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataLayerListComponent, MockDataLayerOptionsComponent],
      imports: [MatExpansionModule, DragDropModule],
      providers: [
        { provide: DataLayerManagerService, useValue: mockLayerManager },
        { provide: DataLayerColorService, useValue: mockColorService },
        { provide: COLOR_PALETTE, useValue: ['#000000', '#ffffff'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataLayerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when getLayerId called should return layer id', () => {
    const index: any = 0;
    const layer: any = {
      id: '-109669932',
      name: 'Blood Pressure',
      category: 'vital-signs',
      datasets: [
        {
          label: 'Diastolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            { x: 1359454965000, y: 96 },
            { x: 1362478965000, y: 90 },
            { x: 1387880565000, y: 91 },
            { x: 1396347765000, y: 88 },
            { x: 1419330165000, y: 91 },
            { x: 1421749365000, y: 99 },
            { x: 1428402165000, y: 87 },
            { x: 1439893365000, y: 90 },
            { x: 1442312565000, y: 102 },
            { x: 1444731765000, y: 88 },
            { x: 1447755765000, y: 91 },
            { x: 1450174965000, y: 91 },
            { x: 1455618165000, y: 94 },
            { x: 1458037365000, y: 89 },
            { x: 1460456565000, y: 93 },
            { x: 1461666165000, y: 90 },
            { x: 1470738165000, y: 92 },
            { x: 1476181365000, y: 88 },
            { x: 1481019765000, y: 88 },
            { x: 1486462965000, y: 90 },
            { x: 1492510965000, y: 88 },
            { x: 1507026165000, y: 98 },
            { x: 1510050165000, y: 88 },
            { x: 1512469365000, y: 88 },
            { x: 1517307765000, y: 87 },
            { x: 1524565365000, y: 97 },
            { x: 1533637365000, y: 92 },
            { x: 1535451765000, y: 89 },
            { x: 1538475765000, y: 92 },
            { x: 1548757365000, y: 95 },
            { x: 1556619765000, y: 94 },
            { x: 1559643765000, y: 91 },
            { x: 1561458165000, y: 94 },
            { x: 1571739765000, y: 89 },
            { x: 1574763765000, y: 91 },
            { x: 1587464565000, y: 94 },
            { x: 1588674165000, y: 94 },
            { x: 1595326965000, y: 91 },
            { x: 1596882165000, y: 88 },
            { x: 1597746165000, y: 88 },
            { x: 1600770165000, y: 92 },
            { x: 1603189365000, y: 87 },
            { x: 1608632565000, y: 88 },
            { x: 1613470965000, y: 96 },
            { x: 1620728565000, y: 91 },
            { x: 1631614965000, y: 91 },
            { x: 1641896565000, y: 89 },
            { x: 1649758965000, y: 90 },
            { x: 1652782965000, y: 93 },
            { x: 1655806965000, y: 96 },
            { x: 1657621365000, y: 89 },
            { x: 1660040565000, y: 89 },
            { x: 1662459765000, y: 88 },
            { x: 1665483765000, y: 96 },
          ],
          borderColor: '#e41a1c',
          backgroundColor: '#e41a1c33',
          pointBorderColor: '#e41a1c',
          pointBackgroundColor: '#e41a1c',
          hidden: false,
        },
        {
          label: 'Systolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            { x: 1359454965000, y: 124 },
            { x: 1362478965000, y: 123 },
            { x: 1387880565000, y: 129 },
            { x: 1396347765000, y: 128 },
            { x: 1419330165000, y: 121 },
            { x: 1421749365000, y: 130 },
            { x: 1428402165000, y: 124 },
            { x: 1439893365000, y: 121 },
            { x: 1442312565000, y: 127 },
            { x: 1444731765000, y: 131 },
            { x: 1447755765000, y: 123 },
            { x: 1450174965000, y: 131 },
            { x: 1455618165000, y: 122 },
            { x: 1458037365000, y: 124 },
            { x: 1460456565000, y: 136 },
            { x: 1461666165000, y: 131 },
            { x: 1470738165000, y: 134 },
            { x: 1476181365000, y: 124 },
            { x: 1481019765000, y: 124 },
            { x: 1486462965000, y: 130 },
            { x: 1492510965000, y: 135 },
            { x: 1507026165000, y: 126 },
            { x: 1510050165000, y: 135 },
            { x: 1512469365000, y: 123 },
            { x: 1517307765000, y: 135 },
            { x: 1524565365000, y: 129 },
            { x: 1533637365000, y: 130 },
            { x: 1535451765000, y: 130 },
            { x: 1538475765000, y: 122 },
            { x: 1548757365000, y: 132 },
            { x: 1556619765000, y: 129 },
            { x: 1559643765000, y: 121 },
            { x: 1561458165000, y: 121 },
            { x: 1571739765000, y: 125 },
            { x: 1574763765000, y: 126 },
            { x: 1587464565000, y: 132 },
            { x: 1588674165000, y: 129 },
            { x: 1595326965000, y: 129 },
            { x: 1596882165000, y: 123 },
            { x: 1597746165000, y: 129 },
            { x: 1600770165000, y: 129 },
            { x: 1603189365000, y: 124 },
            { x: 1608632565000, y: 123 },
            { x: 1613470965000, y: 125 },
            { x: 1620728565000, y: 129 },
            { x: 1631614965000, y: 127 },
            { x: 1641896565000, y: 123 },
            { x: 1649758965000, y: 127 },
            { x: 1652782965000, y: 132 },
            { x: 1655806965000, y: 134 },
            { x: 1657621365000, y: 134 },
            { x: 1660040565000, y: 135 },
            { x: 1662459765000, y: 126 },
            { x: 1665483765000, y: 128 },
          ],
          borderColor: '#377eb8',
          backgroundColor: '#377eb833',
          pointBorderColor: '#377eb8',
          pointBackgroundColor: '#377eb8',
          hidden: false,
        },
      ],
      scales: {
        timeline: { position: 'bottom', type: 'time' },
        'mm[Hg]': { display: 'auto', position: 'left', type: 'linear', stack: 'all', title: { display: true, text: 'mm[Hg]' } },
      },
      annotations: [
        {
          label: {
            display: true,
            position: { x: 'start', y: 'end' },
            color: '#666666',
            font: { size: 16, weight: 'normal' },
            content: 'Systolic Blood Pressure Reference Range',
          },
          type: 'box',
          backgroundColor: '#ECF0F9',
          borderWidth: 0,
          drawTime: 'beforeDraw',
          display: false,
          yScaleID: 'mm[Hg]',
          yMax: 130,
          yMin: 90,
        },
        {
          label: {
            display: true,
            position: { x: 'start', y: 'end' },
            color: '#666666',
            font: { size: 16, weight: 'normal' },
            content: 'Diastolic Blood Pressure Reference Range',
          },
          type: 'box',
          backgroundColor: '#ECF0F9',
          borderWidth: 0,
          drawTime: 'beforeDraw',
          display: true,
          yScaleID: 'mm[Hg]',
          yMax: 80,
          yMin: 60,
        },
      ],
      selected: true,
      enabled: true,
    };
    const getId = component.getLayerId(index, layer);
    const layerId = '-109669932';
    expect(getId).toEqual(layerId);
  });

  it('when isCheckboxChecked called should return true', () => {
    const layer: any = {
      id: '-109669932',
      name: 'Blood Pressure',
      category: 'vital-signs',
      datasets: [
        {
          label: 'Diastolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            { x: 1359454965000, y: 96 },
            { x: 1362478965000, y: 90 },
            { x: 1387880565000, y: 91 },
            { x: 1396347765000, y: 88 },
            { x: 1419330165000, y: 91 },
            { x: 1421749365000, y: 99 },
            { x: 1428402165000, y: 87 },
            { x: 1439893365000, y: 90 },
            { x: 1442312565000, y: 102 },
            { x: 1444731765000, y: 88 },
            { x: 1447755765000, y: 91 },
            { x: 1455618165000, y: 94 },
            { x: 1458037365000, y: 89 },
            { x: 1460456565000, y: 93 },
            { x: 1461666165000, y: 90 },
            { x: 1470738165000, y: 92 },
            { x: 1476181365000, y: 88 },
            { x: 1492510965000, y: 88 },
            { x: 1507026165000, y: 98 },
            { x: 1512469365000, y: 88 },
            { x: 1517307765000, y: 87 },
            { x: 1538475765000, y: 92 },
            { x: 1548757365000, y: 95 },
            { x: 1556619765000, y: 94 },
            { x: 1559643765000, y: 91 },
            { x: 1571739765000, y: 89 },
            { x: 1587464565000, y: 94 },
            { x: 1588674165000, y: 94 },
            { x: 1595326965000, y: 91 },
            { x: 1596882165000, y: 88 },
            { x: 1597746165000, y: 88 },
            { x: 1600770165000, y: 92 },
            { x: 1603189365000, y: 87 },
            { x: 1608632565000, y: 88 },
            { x: 1613470965000, y: 96 },
            { x: 1620728565000, y: 91 },
            { x: 1631614965000, y: 91 },
            { x: 1641896565000, y: 89 },
            { x: 1649758965000, y: 90 },
            { x: 1652782965000, y: 93 },
            { x: 1655806965000, y: 96 },
            { x: 1657621365000, y: 89 },
            { x: 1660040565000, y: 89 },
            { x: 1662459765000, y: 88 },
            { x: 1665483765000, y: 96 },
          ],
          borderColor: '#e41a1c',
          backgroundColor: '#e41a1c33',
          pointBorderColor: '#e41a1c',
          pointBackgroundColor: '#e41a1c',
        },
        {
          label: 'Systolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            { x: 1359454965000, y: 124 },
            { x: 1362478965000, y: 123 },
            { x: 1387880565000, y: 129 },
            { x: 1396347765000, y: 128 },
            { x: 1419330165000, y: 121 },
            { x: 1421749365000, y: 130 },
            { x: 1428402165000, y: 124 },
            { x: 1439893365000, y: 121 },
            { x: 1442312565000, y: 127 },
            { x: 1444731765000, y: 131 },
            { x: 1447755765000, y: 123 },
            { x: 1455618165000, y: 122 },
            { x: 1458037365000, y: 124 },
            { x: 1460456565000, y: 136 },
            { x: 1461666165000, y: 131 },
            { x: 1470738165000, y: 134 },
            { x: 1476181365000, y: 124 },
            { x: 1492510965000, y: 135 },
            { x: 1507026165000, y: 126 },
            { x: 1512469365000, y: 123 },
            { x: 1517307765000, y: 135 },
            { x: 1538475765000, y: 122 },
            { x: 1548757365000, y: 132 },
            { x: 1556619765000, y: 129 },
            { x: 1559643765000, y: 121 },
            { x: 1571739765000, y: 125 },
            { x: 1587464565000, y: 132 },
            { x: 1588674165000, y: 129 },
            { x: 1595326965000, y: 129 },
            { x: 1596882165000, y: 123 },
            { x: 1597746165000, y: 129 },
            { x: 1600770165000, y: 129 },
            { x: 1603189365000, y: 124 },
            { x: 1608632565000, y: 123 },
            { x: 1613470965000, y: 125 },
            { x: 1620728565000, y: 129 },
            { x: 1631614965000, y: 127 },
            { x: 1641896565000, y: 123 },
            { x: 1649758965000, y: 127 },
            { x: 1652782965000, y: 132 },
            { x: 1655806965000, y: 134 },
            { x: 1657621365000, y: 134 },
            { x: 1660040565000, y: 135 },
            { x: 1662459765000, y: 126 },
            { x: 1665483765000, y: 128 },
          ],
          borderColor: '#377eb8',
          backgroundColor: '#377eb833',
          pointBorderColor: '#377eb8',
          pointBackgroundColor: '#377eb8',
        },
      ],
      scales: {
        timeline: { position: 'bottom', type: 'time' },
        'mm[Hg]': { display: 'auto', position: 'left', type: 'linear', stack: 'all', title: { display: true, text: 'mm[Hg]' } },
      },
      annotations: [
        {
          label: {
            display: true,
            position: { x: 'start', y: 'end' },
            color: '#666666',
            font: { size: 16, weight: 'normal' },
            content: 'Systolic Blood Pressure Reference Range',
          },
          type: 'box',
          backgroundColor: '#ECF0F9',
          borderWidth: 0,
          drawTime: 'beforeDraw',
          display: false,
          yScaleID: 'mm[Hg]',
          yMax: 130,
          yMin: 90,
        },
        {
          label: {
            display: true,
            position: { x: 'start', y: 'end' },
            color: '#666666',
            font: { size: 16, weight: 'normal' },
            content: 'Diastolic Blood Pressure Reference Range',
          },
          type: 'box',
          backgroundColor: '#ECF0F9',
          borderWidth: 0,
          drawTime: 'beforeDraw',
          display: true,
          yScaleID: 'mm[Hg]',
          yMax: 80,
          yMin: 60,
        },
      ],
      selected: true,
      enabled: true,
    };
    expect(component.isCheckboxChecked(layer)).toBe(true);
  });

  it('when isCheckboxIndeterminate called should return false', () => {
    const layer: any = {
      id: '-109669932',
      name: 'Blood Pressure',
      category: 'vital-signs',
      datasets: [
        {
          label: 'Diastolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            {
              x: 1359454965000,
              y: 96,
            },
            {
              x: 1362478965000,
              y: 90,
            },
            {
              x: 1387880565000,
              y: 91,
            },
            {
              x: 1396347765000,
              y: 88,
            },
            {
              x: 1419330165000,
              y: 91,
            },
            {
              x: 1421749365000,
              y: 99,
            },
            {
              x: 1428402165000,
              y: 87,
            },
            {
              x: 1439893365000,
              y: 90,
            },
            {
              x: 1442312565000,
              y: 102,
            },
            {
              x: 1444731765000,
              y: 88,
            },
            {
              x: 1447755765000,
              y: 91,
            },
            {
              x: 1455618165000,
              y: 94,
            },
            {
              x: 1458037365000,
              y: 89,
            },
            {
              x: 1460456565000,
              y: 93,
            },
            {
              x: 1461666165000,
              y: 90,
            },
            {
              x: 1470738165000,
              y: 92,
            },
            {
              x: 1476181365000,
              y: 88,
            },
            {
              x: 1492510965000,
              y: 88,
            },
            {
              x: 1507026165000,
              y: 98,
            },
            {
              x: 1512469365000,
              y: 88,
            },
            {
              x: 1517307765000,
              y: 87,
            },
            {
              x: 1538475765000,
              y: 92,
            },
            {
              x: 1548757365000,
              y: 95,
            },
            {
              x: 1556619765000,
              y: 94,
            },
            {
              x: 1559643765000,
              y: 91,
            },
            {
              x: 1571739765000,
              y: 89,
            },
            {
              x: 1587464565000,
              y: 94,
            },
            {
              x: 1588674165000,
              y: 94,
            },
            {
              x: 1595326965000,
              y: 91,
            },
            {
              x: 1596882165000,
              y: 88,
            },
            {
              x: 1597746165000,
              y: 88,
            },
            {
              x: 1600770165000,
              y: 92,
            },
            {
              x: 1603189365000,
              y: 87,
            },
            {
              x: 1608632565000,
              y: 88,
            },
            {
              x: 1613470965000,
              y: 96,
            },
            {
              x: 1620728565000,
              y: 91,
            },
            {
              x: 1631614965000,
              y: 91,
            },
            {
              x: 1641896565000,
              y: 89,
            },
            {
              x: 1649758965000,
              y: 90,
            },
            {
              x: 1652782965000,
              y: 93,
            },
            {
              x: 1655806965000,
              y: 96,
            },
            {
              x: 1657621365000,
              y: 89,
            },
            {
              x: 1660040565000,
              y: 89,
            },
            {
              x: 1662459765000,
              y: 88,
            },
            {
              x: 1665483765000,
              y: 96,
            },
          ],
          borderColor: '#e41a1c',
          backgroundColor: '#e41a1c33',
          pointBorderColor: '#e41a1c',
          pointBackgroundColor: '#e41a1c',
        },
        {
          label: 'Systolic Blood Pressure',
          yAxisID: 'mm[Hg]',
          data: [
            {
              x: 1359454965000,
              y: 124,
            },
            {
              x: 1362478965000,
              y: 123,
            },
            {
              x: 1387880565000,
              y: 129,
            },
            {
              x: 1396347765000,
              y: 128,
            },
            {
              x: 1419330165000,
              y: 121,
            },
            {
              x: 1421749365000,
              y: 130,
            },
            {
              x: 1428402165000,
              y: 124,
            },
            {
              x: 1439893365000,
              y: 121,
            },
            {
              x: 1442312565000,
              y: 127,
            },
            {
              x: 1444731765000,
              y: 131,
            },
            {
              x: 1447755765000,
              y: 123,
            },
            {
              x: 1455618165000,
              y: 122,
            },
            {
              x: 1458037365000,
              y: 124,
            },
            {
              x: 1460456565000,
              y: 136,
            },
            {
              x: 1461666165000,
              y: 131,
            },
            {
              x: 1470738165000,
              y: 134,
            },
            {
              x: 1476181365000,
              y: 124,
            },
            {
              x: 1492510965000,
              y: 135,
            },
            {
              x: 1507026165000,
              y: 126,
            },
            {
              x: 1512469365000,
              y: 123,
            },
            {
              x: 1517307765000,
              y: 135,
            },
            {
              x: 1538475765000,
              y: 122,
            },
            {
              x: 1548757365000,
              y: 132,
            },
            {
              x: 1556619765000,
              y: 129,
            },
            {
              x: 1559643765000,
              y: 121,
            },
            {
              x: 1571739765000,
              y: 125,
            },
            {
              x: 1587464565000,
              y: 132,
            },
            {
              x: 1588674165000,
              y: 129,
            },
            {
              x: 1595326965000,
              y: 129,
            },
            {
              x: 1596882165000,
              y: 123,
            },
            {
              x: 1597746165000,
              y: 129,
            },
            {
              x: 1600770165000,
              y: 129,
            },
            {
              x: 1603189365000,
              y: 124,
            },
            {
              x: 1608632565000,
              y: 123,
            },
            {
              x: 1613470965000,
              y: 125,
            },
            {
              x: 1620728565000,
              y: 129,
            },
            {
              x: 1631614965000,
              y: 127,
            },
            {
              x: 1641896565000,
              y: 123,
            },
            {
              x: 1649758965000,
              y: 127,
            },
            {
              x: 1652782965000,
              y: 132,
            },
            {
              x: 1655806965000,
              y: 134,
            },
            {
              x: 1657621365000,
              y: 134,
            },
            {
              x: 1660040565000,
              y: 135,
            },
            {
              x: 1662459765000,
              y: 126,
            },
            {
              x: 1665483765000,
              y: 128,
            },
          ],
          borderColor: '#377eb8',
          backgroundColor: '#377eb833',
          pointBorderColor: '#377eb8',
          pointBackgroundColor: '#377eb8',
        },
      ],
      scales: {
        timeline: {
          position: 'bottom',
          type: 'time',
        },
        'mm[Hg]': {
          display: 'auto',
          position: 'left',
          type: 'linear',
          stack: 'all',
          title: {
            display: true,
            text: 'mm[Hg]',
          },
        },
      },
      annotations: [
        {
          label: {
            display: true,
            position: {
              x: 'start',
              y: 'end',
            },
            color: '#666666',
            font: {
              size: 16,
              weight: 'normal',
            },
            content: 'Systolic Blood Pressure Reference Range',
          },
          type: 'box',
          backgroundColor: '#ECF0F9',
          borderWidth: 0,
          drawTime: 'beforeDraw',
          display: false,
          yScaleID: 'mm[Hg]',
          yMax: 130,
          yMin: 90,
        },
        {
          label: {
            display: true,
            position: {
              x: 'start',
              y: 'end',
            },
            color: '#666666',
            font: {
              size: 16,
              weight: 'normal',
            },
            content: 'Diastolic Blood Pressure Reference Range',
          },
          type: 'box',
          backgroundColor: '#ECF0F9',
          borderWidth: 0,
          drawTime: 'beforeDraw',
          display: true,
          yScaleID: 'mm[Hg]',
          yMax: 80,
          yMin: 60,
        },
      ],
      selected: true,
      enabled: true,
    };
    expect(component.isCheckboxIndeterminate(layer)).toBe(false);
  });
});
