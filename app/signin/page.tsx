import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import App from '../qweave_app';
import { hasSupabaseConfig } from '../../lib/supabase/config';
import { createClient } from '../../lib/supabase/server';

export const metadata: Metadata = {
  title: 'Sign in | QWeave',
};

export const dynamic = 'force-dynamic';

export default async function SignInPage() {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && error.name !== 'AuthSessionMissingError') {
      throw error;
    }

    if (user) {
      redirect('/dashboard');
    }
  }

  return <App initialView="login" />;
}
