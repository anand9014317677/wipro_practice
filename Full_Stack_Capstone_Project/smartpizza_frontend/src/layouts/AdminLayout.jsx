import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3, Bike, ChefHat, ChevronLeft, LayoutDashboard, ListChecks, LogOut,
  Menu as MenuIcon, Pizza, ShieldCheck, Tags, Users, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/live-orders', label: 'Live Orders', icon: ListChecks },
  { to: '/admin/kitchen', label: 'Kitchen', icon: ChefHat },
  { to: '/admin/assign-delivery', label: 'Assign Delivery', icon: Bike },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/pizzas', label: 'Pizzas', icon: Pizza },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop rail

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const NavItems = ({ onNavigate }) => (
    <nav className="mt-4 flex flex-1 flex-col gap-1">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`
          }>
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span layoutId="admin-active" className="absolute inset-0 -z-0 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-900/40" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <n.icon className="relative z-10 h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="relative z-10 truncate">{n.label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const Brand = (
    <div className="flex items-center gap-2 px-1 text-white">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow"><ShieldCheck className="h-5 w-5" /></span>
      {!collapsed && (
        <div><p className="text-sm font-bold leading-tight">SmartPizza</p><p className="text-[10px] uppercase tracking-widest text-indigo-300">Admin</p></div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 text-white md:hidden">
        <span className="font-bold">SmartPizza Admin</span>
        <button onClick={() => setDrawer(true)}><MenuIcon className="h-6 w-6" /></button>
      </div>

      <div className="flex">
        {/* desktop sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 76 : 256 }}
          className="sticky top-0 hidden h-screen flex-col bg-slate-900 p-3 md:flex"
        >
          <div className="flex items-center justify-between">
            {Brand}
            <button onClick={() => setCollapsed((c) => !c)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white">
              <motion.span animate={{ rotate: collapsed ? 180 : 0 }}><ChevronLeft className="h-4 w-4" /></motion.span>
            </button>
          </div>
          <NavItems />
          <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-5 w-5 flex-shrink-0" /> {!collapsed && 'Logout'}
          </button>
        </motion.aside>

        {/* mobile drawer */}
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setDrawer(false)} />
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween' }}
                className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 p-3 md:hidden"
              >
                <div className="flex items-center justify-between">{Brand}
                  <button className="text-slate-400" onClick={() => setDrawer(false)}><X className="h-5 w-5" /></button>
                </div>
                <NavItems onNavigate={() => setDrawer(false)} />
                <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* content */}
        <main className="min-h-screen flex-1 px-4 py-6 md:px-8">
          <div className="mb-6 flex items-center justify-end">
            <span className="text-sm text-slate-500">Signed in as <span className="font-semibold text-slate-700">{user?.fullName}</span></span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
