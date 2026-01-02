"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface RefreshDataType {
  method: string;
  timestamp: number;
}

interface RefreshDataContextType {
  refreshData: RefreshDataType | null;
  setRefreshData: (data: RefreshDataType | null) => void;
}

const RefreshDataContext = createContext<RefreshDataContextType | undefined>(undefined);

export function RefreshDataProvider({ children }: { children: ReactNode }) {
  const [refreshData, setRefreshData] = useState<RefreshDataType | null>(null);

  return (
    <RefreshDataContext.Provider value={{ refreshData, setRefreshData }}>
      {children}
    </RefreshDataContext.Provider>
  );
}

export function useRefreshData() {
  const context = useContext(RefreshDataContext);
  if (context === undefined) {
    throw new Error('useRefreshData must be used within a RefreshDataProvider');
  }
  return context;
}
