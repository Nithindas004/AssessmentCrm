'use client';

import { useSession } from 'next-auth/react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import SalespersonDashboard from '@/components/dashboard/SalespersonDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (session?.user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (session?.user.role === 'salesperson') {
    return <SalespersonDashboard />;
  }

  return null; // Or a redirect/error component
}