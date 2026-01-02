"use client";

import { ReactNode } from 'react';
import { UserDetailProvider } from '@/context/UserDetailContext';
import { SettingProvider } from '@/context/SettingContext';
import { RefreshDataProvider } from '@/context/RefreshDataContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UserDetailProvider>
      <SettingProvider>
        <RefreshDataProvider>
          {children}
        </RefreshDataProvider>
      </SettingProvider>
    </UserDetailProvider>
  );
}
