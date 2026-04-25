// ============================================================
// LoginPage.tsx — Feature: Auth
// Mirrors the mobile login_page.tsx design:
//   • White card on a warm background
//   • Poppins font, #C67C4E coffee brown primary
//   • Error message shown inline (same as mobile errorText)
//   • Shows/hides password toggle
//
// Auth flow:
//   signIn() in AuthContext → POST /auth/login → role check
//   → navigate to /dashboard on success
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';
import { AppRoutes } from '../../../core/routes/app_routes';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate          = useNavigate();
  const { signIn }        = useAuth();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!email && !password) { toast.error('Please fill in all fields.'); return; }
    if (!email)              { toast.error('Email is required.');          return; }
    if (!password)           { toast.error('Password is required.');       return; }

    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
      toast.success('Logged in successfully!');
      navigate(AppRoutes.DASHBOARD);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] p-6">
      <div className="bg-surface rounded-[24px] p-8 md:p-12 w-full max-w-[440px] shadow-lg flex flex-col">

        {/* Coffee logo */}
        <div className="self-start mb-8">
          <div className="w-16 h-16 rounded-[20px] bg-[#F8ECE4] flex items-center justify-center">
            <Coffee size={32} color="#C67C4E" />
          </div>
        </div>

        <h1 className="text-[28px] font-semibold text-text-main mb-2">Sign in</h1>
        <p className="text-base text-text-muted mb-8 font-normal">Welcome back, Admin</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

          {/* Email field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="login-email" className="text-sm font-medium text-text-main">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full h-[52px] border border-[#E2E8F0] rounded-xl px-4 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:border-primary focus:bg-white outline-none"
              autoComplete="email"
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div className="flex flex-col gap-2">
            <label htmlFor="login-password" className="text-sm font-medium text-text-main">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[52px] border border-[#E2E8F0] rounded-xl px-4 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:border-primary focus:bg-white outline-none pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="h-14 bg-primary text-white rounded-2xl font-semibold text-base mt-4 flex items-center justify-center hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Sign in →'}
          </button>

        </form>
      </div>
    </div>
  );
}
