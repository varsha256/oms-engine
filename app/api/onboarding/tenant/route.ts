import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import { createTenantForUser } from '../../../../services/tenantService';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    if (authError && authError.name !== 'AuthSessionMissingError') {
      console.error('Tenant onboarding Auth verification failed:', authError);
    }
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const companyName =
    typeof body === 'object' && body !== null && 'companyName' in body
      ? body.companyName
      : undefined;

  if (
    typeof companyName !== 'string' ||
    companyName.trim().length === 0 ||
    companyName.trim().length > 160
  ) {
    return NextResponse.json(
      { error: 'Company name must be between 1 and 160 characters.' },
      { status: 400 }
    );
  }

  try {
    const membership = await createTenantForUser(user.id, companyName);
    return NextResponse.json(
      {
        tenant: {
          id: membership.tenant.id,
          companyName: membership.tenant.companyName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Tenant creation failed:', error);
    return NextResponse.json(
      { error: 'Unable to create the workspace. Please try again.' },
      { status: 500 }
    );
  }
}
