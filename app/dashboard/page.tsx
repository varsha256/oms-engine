import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';
import TenantSetup from './tenant-setup';
import { hasSupabaseConfig } from '../../lib/supabase/config';
import { createClient } from '../../lib/supabase/server';
import { findTenantForUser, createTenantForUser } from '../../services/tenantService';

export const dynamic = 'force-dynamic';

export default async function DashboardRoute() {
  if (!hasSupabaseConfig()) {
    redirect('/signin');
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== 'AuthSessionMissingError') {
    throw error;
  }

  if (!user) {
    redirect('/signin');
  }

  let membership = await findTenantForUser(user.id);
  const companyName = user.user_metadata?.company_name;

  if (!membership && typeof companyName === 'string' && companyName.trim()) {
    membership = await createTenantForUser(user.id, companyName);
  }

  if (!membership) {
    return <TenantSetup userEmail={user.email ?? ''} />;
  }

  return (
    <DashboardClient
      userEmail={user.email ?? ''}
      tenantName={membership.tenant.companyName}
    />
  );
}
