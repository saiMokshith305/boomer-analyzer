import { useState, useEffect } from 'react';

const createStore = () => {
  let state = {
    parsedData: null,
    selectedEntity: null,
    filterType: 'all',
    searchQuery: '',
    viewMode: 'list', // 'list' or 'graph'
    selectedAttribute: null,
  };
  const listeners = new Set();

  const notify = () => {
    listeners.forEach(fn => fn({}));
  };

  return () => {
    const [, forceUpdate] = useState({});
    
    useEffect(() => {
      listeners.add(forceUpdate);
      return () => listeners.delete(forceUpdate);
    }, [forceUpdate]);

    return {
      ...state,
      setParsedData: (data) => {
        state.parsedData = data;
        notify();
      },
      setSelectedEntity: (entity) => {
        state.selectedEntity = entity;
        notify();
      },
      setFilterType: (type) => {
        state.filterType = type;
        state.searchQuery = '';
        notify();
      },
      setSearchQuery: (query) => {
        state.searchQuery = query;
        notify();
      },
      setViewMode: (mode) => {
        state.viewMode = mode;
        notify();
      },
      setSelectedAttribute: (attr) => {
        state.selectedAttribute = attr;
        notify();
      },
    };
  };
};

export const useStore = createStore();