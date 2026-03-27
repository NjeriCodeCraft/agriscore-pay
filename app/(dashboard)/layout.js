// app/(dashboard)/layout.js
// ⚠️ DO NOT add <html> or <body> here — root layout handles that

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Auth guard — if no user in localStorage, send to auth
    const user = localStorage.getItem('agriscore_user');
    if (!user) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f0a' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}