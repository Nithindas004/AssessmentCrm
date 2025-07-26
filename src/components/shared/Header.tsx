// src/components/shared/Header.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <h1 className="text-lg font-bold">Test CRM</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {session?.user?.name || 'User'}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;