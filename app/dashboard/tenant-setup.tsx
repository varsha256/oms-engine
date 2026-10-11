'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantSetup({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/onboarding/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof result === 'object' &&
          result !== null &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'Unable to create your workspace.';
        setErrorMessage(message);
        return;
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to create your workspace.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] p-6 text-zinc-200">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <h1 className="text-2xl font-bold text-white">Create your workspace</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Signed in as {userEmail}. Add your business name to finish setting up QWeave.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-zinc-300" htmlFor="company-name">
            Company name
          </label>
          <input
            id="company-name"
            name="companyName"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            maxLength={160}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-orange-500"
            placeholder="Your business"
          />
          {errorMessage && (
            <p className="text-sm text-red-400" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating workspace…' : 'Create workspace'}
          </button>
        </form>
      </section>
    </main>
  );
}
