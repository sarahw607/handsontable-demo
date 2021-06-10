import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { isEmpty, pickBy } from 'lodash-es';
import { ColumnData, FormOption } from 'app/models/columns.model';
import { SortOrder } from 'app/enums';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'asset-table',
  templateUrl: './asset-table.component.html',
})
export class AssetTableComponent implements OnDestroy, OnInit {
  @Input() action;

  countries: FormOption[];
  dynamicColumns$: Observable<any> = of([
    { name: 'Test 1', displaySequence: 5000 },
    { name: 'Test 2', displaySequence: 5001 },
    { name: 'Test 3', displaySequence: 5002 },
    { name: 'Test 4', displaySequence: 5003 },
  ]);

  loading = true;
  rowId = 1;
  subs: Subscription = new Subscription();
  table: Handsontable;
  tableColumnDataMapping: ColumnData[];
  tableData: any[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  tableId = 'asset-entry';
  tableSettings: Handsontable.GridSettings;

  private tableRegisterer = new HotTableRegisterer();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.initTableData();
  }

  addNewRow(goToNewRow = true): void {
    const row = this.table.countRows();
    this.table.alter('insert_row', row, 1);
    if (goToNewRow) {
      this.table.selectCell(row, 1);
    }
  }

  private afterChangeHook(): void {
    Handsontable.hooks.add(
      'afterChange',
      (changes, source) => {
        const addNewRow =
          this.table.getSourceData().filter(obj => {
            const cleanObject = pickBy(obj, value => value !== '' && !this.isEmpty(value));
            return isEmpty(cleanObject);
          }).length <= 0;

        if (addNewRow) {
          this.addNewRow(false);
        }

        this.changeDetector.detectChanges();
      },
      this.table,
    );
  }

  private createTable(): void {
    this.tableSettings = {
      afterInit: () => {
        this.table = this.tableRegisterer.getInstance(this.tableId);
        this.afterChangeHook();
      },
      colHeaders: this.tableColumnDataMapping.map(col => col.header),
      columns: this.tableColumnDataMapping,
      contextMenu: ['row_above', 'row_below', 'remove_row'],
      currentRowClassName: 'currentRow',
      data: this.tableData,
      fixedColumnsLeft: 1,
      height: 600,
      hiddenColumns: {
        columns: [0],
        indicators: false,
      },
      licenseKey: environment.licenseKeys.handsontable,
      manualColumnResize: true,
      rowHeaders: false,
      viewportRowRenderingOffset: 50,
      width: '100%',
    };
  }

  private initTableData(): void {
    this.tableColumnDataMapping = [
      { displaySequence: 0, filterBy: false, header: 'ID', readOnly: true, data: '' },
      {
        displaySequence: 1,
        header: 'Address Lookup',
        strict: true,
        width: 250,
        data: '',
      },
      {
        displaySequence: 1010,
        header: 'Address 1',
        data: '',
      },
      {
        displaySequence: 1011,
        header: 'Address 2',
        data: '',
      },
      {
        displaySequence: 51,
        header: 'Address 2',
        data: '',
      },
      {
        displaySequence: 1041,
        header: 'Address 3',
        data: '',
      },
      {
        displaySequence: 1070,
        header: 'City',
        data: '',
      },
      { displaySequence: 1090, header: 'Postcde', data: '' },
      { displaySequence: 1100, header: 'Country', data: '' },

      {
        displaySequence: 1120,
        header: 'Latitude',
        data: '',
      },
      { displaySequence: 1110, header: 'Longitude', data: '' },
    ];

    this.dynamicColumns$.subscribe(cols => {
      cols.forEach(col => {
        this.tableColumnDataMapping.push({ displaySequence: col.displaySequence, header: col.name, data: '' });
      });

      // Sort the columns by displaySequence
      this.tableColumnDataMapping = this.tableColumnDataMapping.sort((a, b) =>
        this.sorter(a.displaySequence, b.displaySequence),
      );
      console.log(this.tableColumnDataMapping);
      this.createTable();
    });
  }
  private isEmpty(value: any): boolean {
    return value == null || value.length === 0;
  }

  private sorter(a, b, order: SortOrder = SortOrder.Ascending): number {
    if (a < b) {
      return order === SortOrder.Descending ? 1 : -1;
    }
    if (a > b) {
      return order === SortOrder.Descending ? -1 : 1;
    }
    return 0;
  }
}
