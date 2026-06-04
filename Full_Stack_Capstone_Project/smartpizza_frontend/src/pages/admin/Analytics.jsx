import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { Activity, Gauge, Lock, Percent, Ticket, Timer, Zap } from 'lucide-react';
import useAdminData from '../../hooks/useAdminData';
import ChartCard from '../../components/admin/ChartCard';
import { adminOrderService } from '../../services/adminOrderService';

const COLORS = ['#6366f1', '#f97316', '#14b8a6', '#f59e0b', '#a855f7', '#22c55e', '#ef4444', '#0ea5e9'];

export default function Analytics() {
  const { loading, busiestHours, menuByCategory, menuMix, popular, deliveries } = useAdminData();
  const peakHasData = busiestHours.some((h) => h.orders > 0);

  // Delivery efficiency from real assignment timestamps (assignedAt -> deliveredAt).
  const efficiency = useMemo(() => {
    const ACTIVE = ['ASSIGNED', 'ACCEPTED', 'READY_TO_PICKUP', 'OUT_FOR_DELIVERY'];
    const completed = (deliveries || []).filter((d) => d.status === 'DELIVERED' && d.assignedAt && d.deliveredAt);
    const mins = (d) => (new Date(d.deliveredAt) - new Date(d.assignedAt)) / 60000;
    const durations = completed.map(mins).filter((m) => m >= 0);
    const avgCompletion = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
    const byPartner = {};
    completed.forEach((d) => {
      const m = mins(d);
      if (m < 0) return;
      const n = d.deliveryPartnerName || 'Unknown';
      (byPartner[n] = byPartner[n] || []).push(m);
    });
    let fastest = null;
    Object.entries(byPartner).forEach(([n, arr]) => {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      if (!fastest || avg < fastest.avg) fastest = { name: n, avg: Math.round(avg) };
    });
    const activeList = (deliveries || []).filter((d) => ACTIVE.includes(d.status));
    const etaVals = activeList.map((d) => d.estimatedMinutesRemaining).filter((v) => v > 0);
    const avgEta = etaVals.length ? Math.round(etaVals.reduce((a, b) => a + b, 0) / etaVals.length) : null;
    return { avgCompletion, fastest, activeWorkload: activeList.length, avgEta };
  }, [deliveries]);

  // Coupon usage from real admin order data.
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    adminOrderService.listOrders().then((o) => setOrders(o || [])).catch(() => {});
  }, []);
  const coupons = useMemo(() => {
    const used = (orders || []).filter((o) => o.couponCode);
    const totalDiscount = used.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
    const counts = {};
    used.forEach((o) => { counts[o.couponCode] = (counts[o.couponCode] || 0) + 1; });
    let most = null;
    Object.entries(counts).forEach(([c, n]) => { if (!most || n > most.count) most = { code: c, count: n }; });
    return { used: used.length, totalDiscount: Math.round(totalDiscount), most };
  }, [orders]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-800">Analytics</h1>
      <p className="mb-6 text-sm text-slate-500">Business insights from real menu, delivery and popularity data.</p>

      {/* Delivery efficiency (real assignment data; ETA is a heuristic estimate) */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Timer, tint: 'bg-indigo-50 text-indigo-600', label: 'Avg delivery time', value: efficiency.avgCompletion != null ? `${efficiency.avgCompletion} min` : '—' },
          { icon: Gauge, tint: 'bg-orange-50 text-orange-600', label: 'Avg ETA (active)', value: efficiency.avgEta != null ? `${efficiency.avgEta} min` : '—' },
          { icon: Zap, tint: 'bg-emerald-50 text-emerald-600', label: 'Fastest partner', value: efficiency.fastest ? efficiency.fastest.name : '—', sub: efficiency.fastest ? `${efficiency.fastest.avg} min avg` : null },
          { icon: Activity, tint: 'bg-teal-50 text-teal-600', label: 'Active workload', value: efficiency.activeWorkload },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${c.tint}`}><c.icon className="h-5 w-5" /></span>
            <p className="truncate text-lg font-extrabold text-slate-800">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
            {c.sub && <p className="text-[11px] text-slate-400">{c.sub}</p>}
          </div>
        ))}
      </div>
      <p className="mb-6 -mt-2 text-[11px] text-slate-400">Delivery time uses real assigned→delivered timestamps. ETA is a heuristic estimate (no GPS data).</p>

      {/* Coupon usage (real order data) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Ticket, tint: 'bg-orange-50 text-orange-600', label: 'Coupons used', value: coupons.used },
          { icon: Ticket, tint: 'bg-indigo-50 text-indigo-600', label: 'Most used coupon', value: coupons.most ? coupons.most.code : '—', sub: coupons.most ? `${coupons.most.count} order(s)` : null },
          { icon: Percent, tint: 'bg-emerald-50 text-emerald-600', label: 'Total discounts given', value: `Rs. ${coupons.totalDiscount}` },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${c.tint}`}><c.icon className="h-5 w-5" /></span>
            <p className="truncate text-lg font-extrabold text-slate-800">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
            {c.sub && <p className="text-[11px] text-slate-400">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Most popular pizzas" subtitle="By order-history popularity score" loading={loading} empty={popular.length === 0}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={popular} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="#f97316" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Busiest hours" subtitle="Orders by hour of day" loading={loading} empty={!peakHasData}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={busiestHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="hour" interval={2} tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="orders" radius={[6, 6, 0, 0]} fill="#6366f1" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Menu by category" subtitle="Catalogue composition" loading={loading} empty={menuByCategory.length === 0}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={menuByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#14b8a6" animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Menu mix" subtitle="Veg vs Non-veg (catalogue)" loading={loading} empty={menuMix.length === 0}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={menuMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label animationDuration={800}>
                {menuMix.map((_, i) => <Cell key={i} fill={['#22c55e', '#ef4444'][i % 2]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* honest pending-endpoint insights */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-slate-800">Coming with backend support</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { t: 'Recommendation usage', d: 'How often AI picks convert to orders — needs click/impression tracking.' },
          { t: 'Conversion funnel', d: 'Cart → checkout → paid → delivered — needs an admin orders/analytics endpoint.' },
        ].map((c) => (
          <div key={c.t} className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-5">
            <span className="rounded-xl bg-slate-100 p-2 text-slate-400"><Lock className="h-5 w-5" /></span>
            <div>
              <p className="font-bold text-slate-700">{c.t}</p>
              <p className="text-sm text-slate-400">{c.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
