import { LogOut, Mail, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABEL = { CUSTOMER: 'Customer', ADMIN: 'Administrator', DELIVERY: 'Delivery partner' };

export default function Profile() {
  const { user, role, logout } = useAuth();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <div className="card p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.fullName || '—'}</p>
            <p className="text-sm text-gray-500">{ROLE_LABEL[role] || role}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{user?.email || '—'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-gray-400" />
            <span>{ROLE_LABEL[role] || role}</span>
          </div>
        </div>
        <button className="btn-outline mt-6 w-full" onClick={logout}>
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );
}
