import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Pizza } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { homeForRole } from '../../utils/roles';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerLogin() {
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
      if (user.role !== 'CUSTOMER') toast(`Signed in as ${user.role.toLowerCase()} — taking you to your dashboard.`);
      else toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-black px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-400/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-400/30 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Pizza className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">SmartPizza</h1>
          <p className="mt-1 text-sm text-white/80">Hot, fresh & AI-picked — just for you.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <input
              name="email" type="email" placeholder="Email"
              className="w-full rounded-xl border border-white/30 bg-white/90 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:bg-white"
              value={form.email} onChange={onChange}
            />
            {errors.email && <p className="mt-1 text-sm text-amber-200">{errors.email}</p>}
          </div>
          <div>
            <input
              name="password" type="password" placeholder="Password"
              className="w-full rounded-xl border border-white/30 bg-white/90 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:bg-white"
              value={form.password} onChange={onChange}
            />
            {errors.password && <p className="mt-1 text-sm text-amber-200">{errors.password}</p>}
          </div>
          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-900 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/80">
          New here?{' '}
          <Link to="/customer/register" className="font-semibold text-white underline">Create an account</Link>
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs text-white/60">
          <Link to="/admin/login" className="hover:text-white">Admin</Link>
          <Link to="/delivery/login" className="hover:text-white">Delivery partner</Link>
        </div>
      </div>
    </div>
  );
}
