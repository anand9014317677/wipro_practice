import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown, ClipboardList, CreditCard, LogOut, Menu as MenuIcon,
  Pizza, ShoppingCart, Sparkles, User, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/recommendations', label: 'AI Picks' },
  { to: '/orders', label: 'Orders' },
  { to: '/payments', label: 'Payments' },
];

export default function CustomerLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition ${isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setOpen(false);
    navigate('/customer/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-orange-100/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow">
              <Pizza className="h-5 w-5" />
            </span>
            Smart<span className="text-orange-600">Pizza</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative rounded-full p-2 text-gray-700 transition hover:bg-orange-50 hover:text-orange-600">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={ddRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 transition hover:border-orange-300"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="max-w-[90px] truncate text-sm font-semibold text-gray-700">
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
                    >
                      <DropLink to="/profile" icon={User} label="Profile" onClick={() => setMenuOpen(false)} />
                      <DropLink to="/orders" icon={ClipboardList} label="My orders" onClick={() => setMenuOpen(false)} />
                      <DropLink to="/payments" icon={CreditCard} label="Payments" onClick={() => setMenuOpen(false)} />
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/customer/login" className="hidden rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 md:block">
                Sign in
              </Link>
            )}

            <button className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden" onClick={() => setOpen((o) => !o)}>
              {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-3">
                {LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    {l.label}
                  </NavLink>
                ))}
                <NavLink to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-orange-50">
                  <Sparkles className="h-4 w-4" /> Profile
                </NavLink>
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="rounded-lg px-2 py-2 text-left text-sm font-semibold text-red-600">Logout</button>
                ) : (
                  <Link to="/customer/login" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-semibold text-orange-600">Sign in</Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function DropLink({ to, icon: Icon, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
