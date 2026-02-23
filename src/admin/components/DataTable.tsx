import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, Edit, Trash2, Eye, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: string[];
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  addButtonText?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  onItemsPerPageChange?: (count: number) => void;
  extraActions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  onSearch,
  onAdd,
  addButtonText = 'Add New',
  onEdit,
  onDelete,
  onView,
  loading = false,
  emptyMessage = 'No data available',
  showSearch = true,
  showAddButton = true,
  showPagination = true,
  itemsPerPage = 10,
  onItemsPerPageChange,
  extraActions
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [itemsPerPageState, setItemsPerPageState] = useState(itemsPerPage);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(item => {
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const value = item[key as keyof T];
          return value && String(value).toLowerCase().includes(query);
        });
      }
      return Object.values(item).some(value => 
        value && String(value).toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey as keyof T];
      const bValue = b[sortKey as keyof T];
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const start = (currentPage - 1) * itemsPerPageState;
    return sortedData.slice(start, start + itemsPerPageState);
  }, [sortedData, currentPage, itemsPerPageState, showPagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPageState);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (count: number) => {
    setItemsPerPageState(count);
    setCurrentPage(1);
    onItemsPerPageChange?.(count);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {showSearch && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brass-500"
            />
          </div>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {showAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-brass-500 text-white rounded-xl hover:bg-brass-600 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{addButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 ${column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200' : ''} ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-brass-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView || extraActions) && (
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map(column => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? '')}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView || extraActions) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {extraActions && extraActions(item)}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPageState}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}

export default DataTable;
