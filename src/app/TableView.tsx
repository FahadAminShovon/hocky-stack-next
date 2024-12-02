'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { Metrics } from './actions/get-data.action';

const pageSize = 10;

type SortByType = keyof Metrics;
type SortOrderType = 'asc' | 'desc';

const TableHeader = ({
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
  sortBy: SortByType;
  name: keyof Metrics;
  sortOrder: SortOrderType;
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrderType>>;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
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
                  className="p-0 hover:bg-transparent active:bg-transparent ml-1 m-0 hover:text-inherit"
                >
                  <ChevronDown
                    className={cn(
                      'text-inherit transition-transform duration-300 ease-in-out rotate-0 ',
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

const TableView = ({ metricsList }: { metricsList: Metrics[] }) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortByType>('totalVisitorCount');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');

  const sortedMetrics = useMemo(() => {
    return [
      ...metricsList.sort((a, b) => {
        if (sortOrder === 'asc') {
          return +a[sortBy] - +b[sortBy];
        }
        return +b[sortBy] - +a[sortBy];
      }),
    ];
  }, [metricsList, sortBy, sortOrder]);

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
            <tr className="text-right [&>*:first-child]:pl-4 [&>*:last-child]:pr-4">
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                className="text-left"
                colSpan={3}
                name="url"
                sortBy={sortBy}
                sortOrder={sortOrder}
                disableSorting
              >
                URL
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="avgScrollPercentage"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Scroll
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="bounceCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Bounce
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="startsWithCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Starts With
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="endsWithCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Ends With
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="totalCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Total
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="totalPageviewCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Page View
              </TableHeader>
              <TableHeader
                setSortOrder={setSortOrder}
                setSortBy={setSortBy}
                name="totalVisitorCount"
                sortBy={sortBy}
                sortOrder={sortOrder}
              >
                Visitors
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.url}
                className="text-right border-b *:py-3 [&>*:first-child]:text-left [&>*:first-child]:pl-4 [&>*:last-child]:pr-4"
              >
                <td colSpan={3} className="break-all">
                  {row.url}
                </td>
                <td>{row.avgScrollPercentage}</td>
                <td>{row.bounceCount}</td>
                <td>{row.startsWithCount}</td>
                <td>{row.endsWithCount}</td>
                <td>{row.totalCount}</td>
                <td>{row.totalPageviewCount}</td>
                <td>{row.totalVisitorCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
