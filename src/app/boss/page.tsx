'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push('/boss/dashboard');
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/boss/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center admin-body">
        <div className="text-4xl animate-bounce">🧁</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center admin-body p-4">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="sprinkle-bar mb-4" />
          <h1
            className="text-3xl text-[var(--accent)] mb-2"
            style={{ fontFamily: 'var(--font-pacifico), cursive' }}
          >
            Boss Mode
          </h1>
          <p className="text-[var(--text-soft)]">
            Welcome back, Emily! Enter your password to manage your shop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-soft)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secret password"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-main w-full justify-center"
          >
            {loading ? 'Logging in...' : 'Enter the Kitchen'}
          </button>
        </form>

        <p className="text-xs text-center text-[var(--text-soft)] mt-6">
          Forgot your password? Ask the person who set this up for you!
        </p>
      </div>
    </div>
  );
}
