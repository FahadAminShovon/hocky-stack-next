import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FieldPath } from 'react-hook-form';
import { TableHeader } from './TableHeader';
import type {
  SortByType,
  SortOrderType,
  TableColumnsType,
} from './table.types';

const Table = <T extends Record<string, any>>({
  metricsList,
  columns,
  defaultSortBy,
  sortOrder: defaultSortOrder = 'desc',
  sortFn,
  tableClassName,
  perPage = 10,
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
  tableClassName?: string;
  perPage?: number;
}) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortByType<T>>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrderType>(defaultSortOrder);

  const totalNumberOfPages = Math.ceil(metricsList.length / perPage);

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
    const start = page * perPage;
    const end = start + perPage;

    return sortedMetrics.slice(start, end);
  }, [sortedMetrics, page, perPage]);

  const nextPage = () => {
    if (data.length < perPage) return;
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };

  return (
    <div className="w-full bg-inherit ">
      <div>
        <Card className="w-full  bg-gray-900/40 backdrop-blur-sm border-gray-800 shadow-lg shadow-blue-900/10">
          <table
            className={cn(
              'table-fixed w-full rounded-lg border-collapse border-spacing-0',
              tableClassName,
            )}
          >
            <thead className="*:whitespace-nowrap border-b border-gray-800">
              <tr
                className="[&>*:first-child]:pl-4
						 [&>:first-child]:text-left
						 [&>*:last-child]:pr-4 text-right *:py-3 
						 "
              >
                {columns.map((column) => (
                  <TableHeader
                    className="font-semibold"
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
                  className="text-right border-b border-gray-800 *:py-3 [&>*:first-child]:text-left [&>*:first-child]:pl-4 [&>*:last-child]:pr-4 *:break-all hover:bg-gray-800/30 hover:shadow-md hover:shadow-blue-900/5 cursor-pointer transition-colors "
                >
                  {columns.map((column, idx) => {
                    const data = row[column.dataIndex];
                    return (
                      <td
                        key={column.dataIndex}
                        colSpan={column.columnSpan ?? 1}
                      >
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
          <div className="py-4  border-gray-800">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={prevPage}
                  className="hover:bg-gray-800/30"
                >
                  <ChevronLeft />
                </PaginationPrevious>
                <PaginationItem>
                  {page + 1} / {totalNumberOfPages}
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={nextPage}
                    className="hover:bg-gray-800/30"
                  >
                    <ChevronRight />
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Table;
