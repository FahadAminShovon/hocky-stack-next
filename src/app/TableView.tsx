'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { NestedKeys } from 'nested-keys-union';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { Metrics } from './actions/get-data.action';
import type { TableColumnsType } from './test';

const pageSize = 10;

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
  name: keyof Metrics;
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
      <table className="w-full">
        <tbody>
          <tr className="*:p-0">
            <td>{children}</td>
            <td>
              {sortBy === name && (
                <Button
                  variant={'ghost'}
                  className="p-0 hover:bg-transparent active:bg-transparent ml-1 m-0 hover:text-inherit h-0"
                >
                  <ChevronDown
                    className={cn(
                      'text-inherit transition-transform duration-300 ease-in-out rotate-0 h-0',
                      {
                        'rotate-180': sortOrder === 'asc',
                      },
                    )}
                  />
                </Button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </th>
  );
};

const TableView = <T extends Record<string, any>>({
  metricsList,
  columns,
  defaultSortBy,
  defaultSortOrder,
  sortFn,
}: {
  metricsList: T[];
  columns: TableColumnsType<T>;
  defaultSortBy: NestedKeys<T>;
  defaultSortOrder?: SortOrderType;
  sortFn?: (a: T, b: T) => number;
}) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortByType<T>>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(
    defaultSortOrder ?? 'asc',
  );

  const sortedMetrics = useMemo(() => {
    return [
      ...metricsList.sort(
        sortFn,
        // (a, b) => {
        //   if (sortOrder === 'asc') {
        //     return +a[sortBy] - +b[sortBy];
        //   }
        //   return +b[sortBy] - +a[sortBy];
        // },
      ),
    ];
  }, [metricsList, sortBy, sortOrder, sortFn]);

  const data = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;

    return sortedMetrics.slice(start, end);
  }, [sortedMetrics, page]);

  const nextPage = () => {
    if (data.length < pageSize) return;
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  return (
    <div className="container mx-auto">
      <div>
        <div className="text-right">
          <Button variant={'ghost'} onClick={prevPage}>
            <ChevronLeft />
          </Button>
          {page + 1}
          <Button variant={'ghost'} onClick={nextPage}>
            <ChevronRight />
          </Button>
        </div>
        <table className="table-fixed w-full">
          <thead className="bg-slate-700 text-gray-300 *:whitespace-nowrap ">
            <tr
              className="[&>*:first-child]:pl-4
						 [&>:first-child]:text-left
						 [&>*:last-child]:pr-4"
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
                className="text-right border-b *:py-3 [&>*:first-child]:text-left [&>*:first-child]:pl-4 [&>*:last-child]:pr-4"
              >
                {columns.map((column, idx) => {
                  const data = row[column.dataIndex];
                  return (
                    <td key={column.dataIndex} colSpan={column.columnSpan ?? 1}>
                      {column.renderData ? column.renderData(data, idx) : data}
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

export default TableView;
