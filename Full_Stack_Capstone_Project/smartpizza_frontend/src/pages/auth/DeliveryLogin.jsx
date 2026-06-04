import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bike, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { homeForRole } from '../../utils/roles';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function DeliveryLogin() {
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
      if (user.role !== 'DELIVERY') toast(`Signed in as ${user.role.toLowerCase()} — redirecting to your area.`);
      else toast.success('Ready to ride!');
      navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-500 to-emerald-600 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-white">
            <Bike className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">SmartPizza Partner</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to start delivering.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <input
              name="email" type="email" placeholder="Email"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={form.email} onChange={onChange}
            />
            {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email}</p>}
          </div>
          <div>
            <input
              name="password" type="password" placeholder="Password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              value={form.password} onChange={onChange}
            />
            {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password}</p>}
          </div>
          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Signing in…' : 'Start shift'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Not a partner? <Link to="/customer/login" className="text-teal-600 hover:underline">Customer sign in</Link>
        </p>
      </div>
    </div>
  );
}
