import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu as MenuIcon, Pizza, ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`;

  const close = () => setOpen(false);

  const NavLinks = () => (
    <>
      <NavLink to="/menu" className={linkClass} onClick={close}>Menu</NavLink>
      {isAuthenticated && <NavLink to="/recommendations" className={linkClass} onClick={close}>For You</NavLink>}
      {isAuthenticated && <NavLink to="/orders" className={linkClass} onClick={close}>Orders</NavLink>}
      {isAuthenticated && <NavLink to="/payments" className={linkClass} onClick={close}>Payments</NavLink>}
      {role === 'ADMIN' && <NavLink to="/admin" className={linkClass} onClick={close}>Admin</NavLink>}
      {(role === 'DELIVERY' || role === 'ADMIN') && <NavLink to="/delivery" className={linkClass} onClick={close}>Deliveries</NavLink>}
    </>
  );

  const CartIcon = () => (
    <Link to="/cart" className="relative text-gray-700 hover:text-primary-600" title="Cart">
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );

  const handleLogout = () => {
    logout();
    close();
    toast.success('Signed out');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary-600">
          <Pizza className="h-6 w-6" /> SmartPizza AI
        </Link>

        <nav className="hidden items-center gap-6 md:flex"><NavLinks /></nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated && role === 'CUSTOMER' && <CartIcon />}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.fullName.split(' ')[0]}</span>
              <button className="btn-outline px-3 py-1.5 text-sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-outline px-3 py-1.5 text-sm">Sign in</Link>
              <Link to="/register" className="btn-primary px-3 py-1.5 text-sm">Register</Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && role === 'CUSTOMER' && <CartIcon />}
          <button className="text-gray-700" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 md:hidden">
          <NavLinks />
          {isAuthenticated ? (
            <button className="btn-outline text-sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={close} className="btn-outline flex-1 text-sm">Sign in</Link>
              <Link to="/register" onClick={close} className="btn-primary flex-1 text-sm">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
