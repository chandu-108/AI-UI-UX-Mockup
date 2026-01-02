"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProjectSettings {
  projectId: string;
  projectName: string;
  theme: string;
  device: string;
  projectVisualDescription?: string;
}

interface SettingContextType {
  settingDetail: ProjectSettings | null;
  setSettingDetail: (settings: ProjectSettings | null) => void;
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export function SettingProvider({ children }: { children: ReactNode }) {
  const [settingDetail, setSettingDetail] = useState<ProjectSettings | null>(null);

  return (
    <SettingContext.Provider value={{ settingDetail, setSettingDetail }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context;
}
