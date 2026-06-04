import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, IndianRupee, Search, Sun } from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import CompletedDeliveryCard from '../../components/delivery/CompletedDeliveryCard';
import EmptyState from '../../components/EmptyState';

const PAGE_SIZE = 8;
const EST_PAYOUT = 40; // estimated payout per delivery (flat)
const isToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso); const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

export default function Completed() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    let active = true;
    deliveryService
      .getDeliveries()
      .then((list) => active && setAll((list || []).filter((d) => d.status === 'DELIVERED')))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => ({
    completed: all.length,
    today: all.filter((d) => isToday(d.deliveredAt)).length,
    earnings: all.length * EST_PAYOUT,
  }), [all]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter((d) =>
      String(d.orderId).includes(term) || (d.customerName || '').toLowerCase().includes(term));
  }, [all, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const STAT_CARDS = [
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, tint: 'bg-teal-50 text-teal-600' },
    { label: 'Today', value: stats.today, icon: Sun, tint: 'bg-amber-50 text-amber-600' },
    { label: 'Est. earnings', value: `₹${stats.earnings}`, icon: IndianRupee, tint: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="px-4 py-4">
      <h1 className="mb-4 text-xl font-extrabold text-gray-900">Completed deliveries</h1>

      {/* stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm"
          >
            <span className={`mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-xl ${s.tint}`}><s.icon className="h-5 w-5" /></span>
            <p className="text-lg font-extrabold text-gray-900">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <p className="mb-4 text-[11px] text-gray-400">Earnings are an estimate (₹{EST_PAYOUT} per completed delivery).</p>

      {/* search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(0); }}
          placeholder="Search by customer or order ID…"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200" />)}</div>
      ) : error ? (
        <EmptyState icon={CheckCircle2} title="Couldn't load history" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="No completed deliveries" message="Delivered orders will show up here." />
      ) : (
        <>
          <div className="space-y-3">
            {pageRows.map((d) => <CompletedDeliveryCard key={d.id} delivery={d} />)}
          </div>
          {filtered.length > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
                disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
                disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
