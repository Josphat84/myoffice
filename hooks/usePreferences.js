// frontend/hooks/usePreferences.js

'use client';
import { useState, useEffect } from 'react';

export function usePreferences() {
  const [preferences, setPreferences] = useState({
    view: 'kanban', // 'kanban' or 'list'
    itemsPerPage: 10,
    sortBy: 'dueDate',
    sortOrder: 'asc',
    showCompleted: true,
    showArchived: false
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('maintenance-preferences');
    if (saved) {
      try {
        setPreferences(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('maintenance-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const setView = (view) => updatePreference('view', view);
  const setItemsPerPage = (count) => updatePreference('itemsPerPage', count);
  const setSortBy = (sortBy) => updatePreference('sortBy', sortBy);
  const setSortOrder = (order) => updatePreference('sortOrder', order);
  const setShowCompleted = (show) => updatePreference('showCompleted', show);
  const setShowArchived = (show) => updatePreference('showArchived', show);

  return {
    preferences,
    updatePreference,
    setView,
    setItemsPerPage,
    setSortBy,
    setSortOrder,
    setShowCompleted,
    setShowArchived
  };
}

export default usePreferences;