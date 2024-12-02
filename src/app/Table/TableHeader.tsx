import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { FieldPath } from 'react-hook-form';
import type { SortByType, SortOrderType } from './table.types';

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
                  strokeWidth={4}
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

export { TableHeader };
