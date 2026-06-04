import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Pizza } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

export default function Register() {
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName || form.fullName.trim().length < 2) next.fullName = 'Enter your full name';
    if (!form.email) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.phone && !PHONE_RE.test(form.phone)) next.phone = 'Phone must be exactly 10 digits';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });
      toast.success(`Account created — welcome, ${user.fullName.split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (err) {
      const fieldErrors = err.response?.data?.fieldErrors;
      if (fieldErrors) {
        setErrors(fieldErrors);
        toast.error('Please fix the highlighted fields');
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 text-primary-600 mb-6">
          <Pizza className="h-8 w-8" />
          <span className="text-2xl font-bold">SmartPizza AI</span>
        </div>
        <h1 className="text-xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Join us and start ordering in minutes.</p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input name="fullName" className="input" value={form.fullName} onChange={onChange} placeholder="Anand Golla" />
            {errors.fullName && <p className="text-sm text-primary-600 mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" className="input" value={form.email} onChange={onChange} placeholder="you@example.com" />
            {errors.email && <p className="text-sm text-primary-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input name="password" type="password" className="input" value={form.password} onChange={onChange} placeholder="At least 6 characters" />
            {errors.password && <p className="text-sm text-primary-600 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="phone" className="input" value={form.phone} onChange={onChange} placeholder="10-digit number" />
            {errors.phone && <p className="text-sm text-primary-600 mt-1">{errors.phone}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
