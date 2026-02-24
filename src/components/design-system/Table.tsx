import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  pagination,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-100">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-small font-semibold text-navy border-b border-surface-200"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                <div className="flex justify-center">
                  <svg className="animate-spin h-6 w-6 text-navy" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={`
                  border-b border-surface-100
                  ${index % 2 === 1 ? 'bg-surface-50' : 'bg-white'}
                  ${onRowClick ? 'cursor-pointer hover:bg-surface-100' : ''}
                  transition-colors duration-150
                `}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-body text-gray-700">
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
          <div className="text-small text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-small font-medium text-navy bg-surface-100 rounded hover:bg-surface-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => pagination.onPageChange(page)}
                  className={`
                    px-3 py-1 text-small font-medium rounded
                    ${page === pagination.currentPage
                      ? 'bg-navy text-white'
                      : 'text-navy bg-surface-100 hover:bg-surface-200'
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 text-small font-medium text-navy bg-surface-100 rounded hover:bg-surface-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
