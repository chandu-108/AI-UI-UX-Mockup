"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserDetail {
  id?: number;
  name: string | null;
  email: string;
  credits: number;
}

interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: (user: UserDetail | null) => void;
}

const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);

export function UserDetailProvider({ children }: { children: ReactNode }) {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export function useUserDetail() {
  const context = useContext(UserDetailContext);
  if (context === undefined) {
    throw new Error('useUserDetail must be used within a UserDetailProvider');
  }
  return context;
}
