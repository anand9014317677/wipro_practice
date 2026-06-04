import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bike, CheckCircle2, LogOut, MapPin, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/delivery', label: 'Assigned', icon: Bike, end: true },
  { to: '/delivery/tracking', label: 'Tracking', icon: MapPin },
  { to: '/delivery/completed', label: 'Completed', icon: CheckCircle2 },
  { to: '/delivery/profile', label: 'Profile', icon: User },
];

export default function DeliveryLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/delivery/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-teal-600 px-4 py-3 text-white">
        <div className="flex items-center gap-2 font-bold">
          <Bike className="h-5 w-5" /> SmartPizza Partner
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      <main className="flex-1 pb-20">
        <p className="px-4 pt-3 text-xs text-gray-400">Hi, {user?.fullName?.split(' ')[0]}</p>
        <Outlet />
      </main>

      {/* bottom nav (mobile-app style) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-gray-200 bg-white">
        {NAV.map((n) => (
          <NavLink
            key={n.to} to={n.to} end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                isActive ? 'text-teal-600' : 'text-gray-400 hover:text-teal-600'
              }`
            }
          >
            <n.icon className="h-5 w-5" /> {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
