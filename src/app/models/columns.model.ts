import { ColumnType, ValueType } from 'app/enums';
import Handsontable from 'handsontable';

export interface ColumnData {
  correctFormat?: boolean;
  data: string;
  dataType?: ValueType;
  dateFormat?: string;
  displaySequence: number;
  filterBy?: boolean;
  header: string;
  label?: any;
  numericFormat?: Handsontable.NumericFormatOptions;
  type?: ColumnType;
  readOnly?: boolean;
  renderer?: any;
  source?: any;
  strict?: boolean;
  width?: number;
}

export interface FormOption {
  id?: number | string;
  label: string;
  value: boolean | number | string;
}
