'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { FieldPath } from 'react-hook-form';
import type { Metrics } from './actions/get-data.action';
import { type TableColumnsType, testColumn } from './test';

const PAGE_SIZE = 10;

type SortByType<T extends Record<string, any>> = keyof T;
type SortOrderType = 'asc' | 'desc';

const TableHeader = <T extends Record<string, any>>({
  children,
  sortBy,
  name,
  sortOrder,
  setSortOrder,
  setSortBy,
  disableSorting,
  className,
  ...props
}: React.ComponentProps<'th'> & {
  sortBy: SortByType<T>;
  name: FieldPath<T>;
  sortOrder: SortOrderType;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrderType>>;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType<T>>>;
  disableSorting?: boolean;
}) => {
  return (
    <th
      className={cn(className)}
      {...props}
      onClick={() => {
        if (disableSorting) return;
        if (sortBy === name) {
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          setSortBy(name);
          setSortOrder('desc');
        }
      }}
    >
      <table className="w-full border-collapse border-spacing-0">
        <tbody>
          <tr className="*:p-0">
            <td>{children}</td>

            {sortBy === name && (
              <td className="m-0 p-0 text-right">
                <ChevronDown
                  className={cn(
                    'text-inherit transition-transform duration-300 ease-in-out rotate-0 size-4 text-right ml-auto',
                    {
                      'rotate-180': sortOrder === 'asc',
                    },
                  )}
                />
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </th>
  );
};

const Table = <T extends Record<string, any>>({
  metricsList,
  columns,
  defaultSortBy,
  sortOrder: defaultSortOrder = 'desc',
  sortFn,
}: {
  metricsList: T[];
  columns: TableColumnsType<T>;
  defaultSortBy: FieldPath<T>;
  sortOrder?: SortOrderType;
  sortFn?: (obj: {
    first: T;
    second: T;
    sortOrder: SortOrderType;
    sortBy: SortByType<T>;
  }) => number;
}) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortByType<T>>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(defaultSortOrder);

  const totalNumberOfPages = Math.ceil(metricsList.length / PAGE_SIZE);

  const sortedMetrics = useMemo(() => {
    if (sortFn) {
      return [
        ...metricsList.sort((a, b) =>
          sortFn({ first: a, second: b, sortOrder, sortBy }),
        ),
      ];
    }

    return [
      ...metricsList.sort((a, b) => {
        if (sortOrder === 'asc') {
          return +a[sortBy] - +b[sortBy];
        }
        return +b[sortBy] - +a[sortBy];
      }),
    ];
  }, [metricsList, sortBy, sortOrder, sortFn]);

  const data = useMemo(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return sortedMetrics.slice(start, end);
  }, [sortedMetrics, page]);

  const nextPage = () => {
    if (data.length < PAGE_SIZE) return;
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  return (
    <div className="w-full">
      <div>
        <div className="text-right">
          {page > 0 && (
            <Button variant={'ghost'} onClick={prevPage}>
              <ChevronLeft />
            </Button>
          )}
          {page + 1}
          {page + 1 < totalNumberOfPages && (
            <Button variant={'ghost'} onClick={nextPage}>
              <ChevronRight />
            </Button>
          )}
        </div>
        <table className="table-fixed w-full">
          <thead className="bg-slate-700 text-gray-300 *:whitespace-nowrap ">
            <tr
              className="[&>*:first-child]:pl-4
						 [&>:first-child]:text-left
						 [&>*:last-child]:pr-4 text-right"
            >
              {columns.map((column) => (
                <TableHeader
                  key={column.dataIndex}
                  setSortOrder={setSortOrder}
                  setSortBy={setSortBy}
                  colSpan={column.columnSpan ?? 1}
                  name={column.dataIndex}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  disableSorting={(column.sortable ?? true) === false}
                >
                  {column.title}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.url}
                className="text-right border-b *:py-3 [&>*:first-child]:text-left [&>*:first-child]:pl-4 [&>*:last-child]:pr-4 *:break-all"
              >
                {columns.map((column, idx) => {
                  const data = row[column.dataIndex];
                  return (
                    <td key={column.dataIndex} colSpan={column.columnSpan ?? 1}>
                      {column.renderData
                        ? column.renderData(data, row, idx)
                        : data}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableView = ({ metricList }: { metricList: Metrics[] }) => {
  return (
    <Table
      metricsList={metricList}
      columns={testColumn}
      defaultSortBy={'totalVisitorCount'}
    />
  );
};

export default TableView;
