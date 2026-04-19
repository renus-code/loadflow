/**
 * ======================================================================================
 * CONTEXT: Search State Management (Zustand)
 * ======================================================================================
 * Provides a high-performance global search state for dashboard filtering.
 * 
 * Features:
 * 1. Store Instancing: Creates unique Zustand stores per request to prevent SSR cross-talk.
 * 2. Atomic Updates: Utilizes the selector pattern (useSearch) for surgically precise re-renders.
 * 3. Centralized Filtering: Connects the global Navbar search to localized table components.
 * ======================================================================================
 */
"use client";

// Search State: Powers the fast search bar for filtering dashboard tables.

import React, { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Ensure the store is instanced per-request for Next.js SSR
type SearchStore = ReturnType<typeof createSearchStore>;

const createSearchStore = () =>
  createStore<SearchState>()((set) => ({
    searchTerm: "",
    setSearchTerm: (term) => set({ searchTerm: term }),
  }));

const SearchContext = createContext<SearchStore | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<SearchStore | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = createSearchStore();
  }

  return (
    <SearchContext.Provider value={storeRef.current}>
      {children}
    </SearchContext.Provider>
  );
}

// Selector pattern for atomic state updates (High Perf)
export function useSearch<T>(selector: (state: SearchState) => T): T {
  const store = useContext(SearchContext);
  if (!store) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return useStore(store, selector);
}
