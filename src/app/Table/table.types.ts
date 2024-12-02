import type { FieldPath, FieldValues } from 'react-hook-form';

type SortByType<T extends Record<string, any>> = keyof T;
type SortOrderType = 'asc' | 'desc';
type TableColumnsType<
  TData extends FieldValues,
  TDataIndex extends FieldPath<TData> = FieldPath<TData>,
> = {
  title?: string | React.ReactNode;
  dataIndex: TDataIndex;
  renderData?: (
    value: TData[TDataIndex],
    data: TData,
    index: number,
  ) => React.ReactNode;
  sortable?: boolean;
  columnSpan?: number;
}[];

export type { SortByType, SortOrderType, TableColumnsType };
