"use client";

import { Header } from '@/app/_shared/Header';
import { Hero } from '@/app/_shared/Hero';
import { ProjectList } from '@/app/_shared/ProjectList';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUserDetail } from '@/context/UserDetailContext';
import axios from 'axios';

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { setUserDetail } = useUserDetail();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      checkAndCreateUser();
    }
  }, [isLoaded, isSignedIn, user]);

  const checkAndCreateUser = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const response = await axios.get('/api/user', { params: { userId: email } });
      
      if (response.data) {
        setUserDetail(response.data);
      } else {
        const newUser = await axios.post('/api/user', {
          name: user?.fullName || user?.firstName || 'User',
          email,
        });
        setUserDetail(newUser.data);
      }
    } catch (error) {
      console.error('Error managing user:', error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <Hero />
      <ProjectList />
    </main>
  );
}
