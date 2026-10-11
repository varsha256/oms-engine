'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPage } from '../qweave_app';
import type { Navigate } from '../qweave_app';
import { createClient } from '../../lib/supabase/client';

export default function DashboardClient({
  userEmail,
  tenantName,
}: {
  userEmail: string;
  tenantName: string;
}) {
  const router = useRouter();
  const [signOutError, setSignOutError] = useState('');

  const handleNavigate: Navigate = (view) => {
    router.push(view === 'landing' ? '/' : '/signin');
  };

  const handleSignOut = async () => {
    setSignOutError('');
    try {
      const { error } = await createClient().auth.signOut({ scope: 'local' });

      if (error) {
        setSignOutError(error.message);
        return;
      }

      router.replace('/signin');
      router.refresh();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out.');
    }
  };

  return (
    <>
      {signOutError && (
        <p role="alert" className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-500/30 bg-zinc-900 px-4 py-3 text-sm text-red-400">
          Sign out failed: {signOutError}
        </p>
      )}
      <DashboardPage
        onNavigate={handleNavigate}
        onSignOut={handleSignOut}
        userEmail={userEmail}
        tenantName={tenantName}
      />
    </>
  );
}
