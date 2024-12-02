import type { NestedKeys } from 'nested-keys-union';
import type { Metrics } from './actions/get-data.action';

type TableColumnType<TData extends Record<string, any>> = {
  title?: string | React.ReactNode;
  dataIndex: NestedKeys<TData>;
  renderData?: (data: TData, index: number) => React.ReactNode;
  sortable?: boolean;
  columnSpan?: number;
};

type TableColumnsType<T extends Record<string, any>> = TableColumnType<T>[];

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
  },
  {
    title: 'Bounce',
    dataIndex: 'bounceCount',
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
    title: 'Total',
    dataIndex: 'totalCount',
  },
  { title: 'Views', dataIndex: 'totalPageviewCount' },
  {
    title: 'Visitors',
    dataIndex: 'totalVisitorCount',
  },
];

export type { TableColumnsType };

export { testColumn };
