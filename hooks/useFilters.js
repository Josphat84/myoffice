// frontend/hooks/useFilters.js

'use client';
import { useState, useMemo } from 'react';

export function useFilters(initialData = []) {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    search: '',
    dateRange: {
      start: null,
      end: null
    }
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // Apply filters and sorting
  const filteredAndSortedData = useMemo(() => {
    let result = [...initialData];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.assignedTo?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      result = result.filter(item => item.priority === filters.priority);
    }

    // Apply assignedTo filter
    if (filters.assignedTo) {
      result = result.filter(item => item.assignedTo === filters.assignedTo);
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(item => {
        const itemDate = new Date(item.dueDate || item.createdAt);
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

        if (start && end) {
          return itemDate >= start && itemDate <= end;
        } else if (start) {
          return itemDate >= start;
        } else if (end) {
          return itemDate <= end;
        }
        return true;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;

        let comparison = 0;
        if (aValue && bValue) {
          if (typeof aValue === 'string') {
            comparison = aValue.localeCompare(bValue);
          } else if (aValue instanceof Date) {
            comparison = new Date(aValue) - new Date(bValue);
          } else {
            comparison = aValue < bValue ? -1 : 1;
          }
        } else if (aValue && !bValue) {
          comparison = -1;
        } else if (!aValue && bValue) {
          comparison = 1;
        }

        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [initialData, filters, sortConfig]);

  // Update a specific filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update date range filter
  const updateDateRange = (start, end) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignedTo: '',
      search: '',
      dateRange: {
        start: null,
        end: null
      }
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const statuses = [...new Set(initialData.map(item => item.status).filter(Boolean))];
    const priorities = [...new Set(initialData.map(item => item.priority).filter(Boolean))];
    const assignedTos = [...new Set(initialData.map(item => item.assignedTo).filter(Boolean))];

    return {
      statuses,
      priorities,
      assignedTos
    };
  }, [initialData]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.assignedTo) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  }, [filters]);

  return {
    // Data
    filteredData: filteredAndSortedData,
    
    // Filter state
    filters,
    sortConfig,
    
    // Filter options
    filterOptions,
    
    // Actions
    updateFilter,
    updateDateRange,
    clearFilters,
    handleSort,
    
    // Metadata
    activeFilterCount,
    totalCount: initialData.length,
    filteredCount: filteredAndSortedData.length
  };
}

export default useFilters;