import React, { useState } from 'react';
import { Lock, User, AlertCircle, ArrowRight, CheckCircle2, Circle, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useExpenses, validatePasswordRules } from '../../context/ExpenseContext';

export const AuthForm = () => {
  const { signIn, signUp, loadDemoData, setActiveView } = useExpenses();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Live password validation checklist
  const rules = validatePasswordRules(password);
  const allRulesPassed = rules.minLength && rules.hasUpper && rules.hasLower && rules.hasNumber && rules.hasSpecial;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!allRulesPassed) {
        setError('Please satisfy all password security requirements listed below.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      const result = mode === 'login' 
        ? signIn(username, password) 
        : signUp(username, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setActiveView('dashboard');
        setLoading(false);
      }
    }, 250);
  };

  const handleDemo = () => {
    loadDemoData();
    setActiveView('dashboard');
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden transition-all">

        {/* MODE SWITCH TABS */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 m-4 mb-0 rounded-2xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* HEADER */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {mode === 'login' ? 'Welcome back 👋' : 'Create Account 🎓'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login' 
                ? 'Enter your username and password to log in.' 
                : 'Choose a unique username and secure password.'}
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. rahul_sharma"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Each username is unique to one user.
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* LIVE PASSWORD REQUIREMENTS CHECKLIST (SIGNUP MODE) */}
            {mode === 'signup' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password Requirements:
                </span>
                
                <div className="grid grid-cols-1 gap-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${rules.minLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.minLength ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>At least 8 characters</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${rules.hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasUpper ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>At least 1 uppercase letter (A-Z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${rules.hasLower ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasLower ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>At least 1 lowercase letter (a-z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>At least 1 number (0-9)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${rules.hasSpecial ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rules.hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Circle className="w-3.5 h-3.5" />}
                    <span>At least 1 special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password (Signup Mode) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* DEMO BUTTON */}
          <button
            type="button"
            onClick={handleDemo}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200/60 dark:border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Try Demo Mode (no account needed)
          </button>
        </div>
      </div>
    </div>
  );
};
