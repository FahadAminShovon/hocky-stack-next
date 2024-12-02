import type { FieldPath, FieldValues } from 'react-hook-form';
import type { Metrics } from './actions/get-data.action';

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

const testColumn: TableColumnsType<Metrics> = [
  {
    title: 'URL',
    dataIndex: 'url',
    columnSpan: 3,
    sortable: false,
  },
  {
    title: 'Scroll',
    dataIndex: 'avgScrollPercentage',
    renderData: (data) => `${data}%`,
  },
  {
    title: 'Bounce',
    dataIndex: 'bounceCount',
    renderData: (data) => `${data}%`,
  },
  {
    title: 'Starts With',
    dataIndex: 'startsWithCount',
  },
  {
    title: 'Ends With',
    dataIndex: 'endsWithCount',
  },
  {
    title: 'Entries',
    dataIndex: 'totalCount',
  },
  { title: 'Page Views', dataIndex: 'totalPageviewCount' },
  {
    title: 'Visitors',
    dataIndex: 'totalVisitorCount',
  },
];

export type { TableColumnsType };

export { testColumn };
