'use client';
import {} from '@/components/ui/pagination';
import {} from 'lucide-react';
import {} from 'react';
import { Table } from './Table';
import type { TableColumnsType } from './Table/table.types';
import type { Metrics } from './actions/get-data.action';

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
  {
    title: 'Score',
    dataIndex: 'score',
  },
];

const TableView = ({ metricList }: { metricList: Metrics[] }) => {
  return (
    <div className="container mx-auto">
      <Table
        metricsList={metricList}
        columns={testColumn}
        defaultSortBy={'score'}
      />
    </div>
  );
};

export default TableView;
