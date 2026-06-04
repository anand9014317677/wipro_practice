import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Bike, CheckCircle2, Clock, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import useAdminData from '../../hooks/useAdminData';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';

const PIE_COLORS = ['#6366f1', '#f97316', '#14b8a6', '#f59e0b', '#a855f7', '#22c55e', '#ef4444'];
const money = (n) => `₹${Math.round(Number(n) || 0).toLocaleString()}`;

export default function Dashboard() {
  const { loading, error, metrics, revenuePerDay, ordersPerDay, statusDistribution } = useAdminData();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-800">Dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">Live overview from delivery & order records.</p>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load admin data. Make sure the backend is running on port 8080.
        </div>
      )}

      {/* metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={ShoppingBag} label="Orders tracked" sub="with a delivery record" value={metrics.ordersTracked} gradient="from-indigo-600 to-indigo-700" />
        <StatCard icon={IndianRupee} label="Revenue (delivered)" value={metrics.revenue} format={money} gradient="from-orange-500 to-orange-600" />
        <StatCard icon={Bike} label="Active deliveries" value={metrics.activeDeliveries} gradient="from-teal-500 to-teal-600" />
        <StatCard icon={Clock} label="Awaiting acceptance" value={metrics.pending} gradient="from-amber-500 to-amber-600" />
        <StatCard icon={CheckCircle2} label="Delivered" value={metrics.delivered} gradient="from-emerald-500 to-emerald-600" />
        <StatCard icon={Users} label="Customers" sub="who have ordered" value={metrics.customers} gradient="from-slate-600 to-slate-700" />
      </div>

      {/* charts */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Revenue (last 7 days)" subtitle="Delivered orders" loading={loading}
          empty={revenuePerDay.every((d) => d.revenue === 0)}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenuePerDay}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip formatter={(v) => money(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} fill="url(#rev)" animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders (last 7 days)" subtitle="By creation date" loading={loading}
          empty={ordersPerDay.every((d) => d.orders === 0)}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="#6366f1" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Delivery status" subtitle="Current distribution" loading={loading}
          empty={statusDistribution.length === 0} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label animationDuration={800}>
                {statusDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
