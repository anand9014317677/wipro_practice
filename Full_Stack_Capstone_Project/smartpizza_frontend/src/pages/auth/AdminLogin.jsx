import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { homeForRole } from '../../utils/roles';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLogin() {
  const { login, loading, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate(homeForRole(role), { replace: true });
  }, [isAuthenticated, role, navigate]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const validate = () => {
    const next = {};
    if (!form.email) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'ADMIN') toast(`Signed in as ${user.role.toLowerCase()} — redirecting to your area.`);
      else toast.success('Welcome, admin.');
      navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">SmartPizza</p>
            <p className="text-xs uppercase tracking-widest text-indigo-300">Admin Console</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <h1 className="mb-1 text-xl font-semibold text-white">Sign in to dashboard</h1>
          <p className="mb-6 text-sm text-slate-400">Authorized personnel only.</p>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <input
                name="email" type="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={form.email} onChange={onChange} placeholder="admin@smartpizza.ai"
              />
              {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Password</label>
              <input
                name="password" type="password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={form.password} onChange={onChange} placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password}</p>}
            </div>
            <button
              type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Access dashboard'}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Not an admin? <Link to="/customer/login" className="text-indigo-400 hover:underline">Customer sign in</Link>
        </p>
      </div>
    </div>
  );
}
