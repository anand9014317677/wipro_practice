import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChefHat, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminOrderService } from '../../services/adminOrderService';
import KitchenOrderCard from '../../components/admin/KitchenOrderCard';

const POLL_MS = 5000;

const COLUMNS = [
  { key: 'new', title: 'New orders', statuses: ['PLACED', 'CONFIRMED'], accent: 'from-blue-500 to-indigo-500', action: { label: 'Accept Order', fn: 'accept' } },
  { key: 'accepted', title: 'Accepted', statuses: ['ACCEPTED'], accent: 'from-indigo-500 to-violet-500', action: { label: 'Start Preparing', fn: 'preparing' } },
  { key: 'preparing', title: 'Preparing', statuses: ['PREPARING'], accent: 'from-amber-500 to-orange-500', action: { label: 'Mark Baked', fn: 'baked' } },
  { key: 'ready', title: 'Ready', statuses: ['BAKED'], accent: 'from-emerald-500 to-teal-500', action: null },
];
const KITCHEN_STATUSES = ['PLACED', 'CONFIRMED', 'ACCEPTED', 'PREPARING', 'BAKED'];

function playBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; g.gain.value = 0.05;
    o.start(); o.stop(ctx.currentTime + 0.15);
  } catch { /* audio blocked — ignore */ }
}

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [now, setNow] = useState(Date.now());
  const seenNew = useRef(null);

  const fetchOrders = async (announce) => {
    try {
      const all = await adminOrderService.listOrders();
      const kitchen = (all || []).filter((o) => KITCHEN_STATUSES.includes(o.status));
      setOrders(kitchen);
      setError(false);

      const newIds = new Set(kitchen.filter((o) => ['PLACED', 'CONFIRMED'].includes(o.status)).map((o) => o.id));
      if (announce && seenNew.current) {
        const fresh = [...newIds].filter((id) => !seenNew.current.has(id)).length;
        if (fresh > 0) {
          toast.success(`${fresh} new order${fresh > 1 ? 's' : ''} in the kitchen`, { icon: '🛎️' });
          playBeep();
        }
      }
      seenNew.current = newIds;
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    const poll = setInterval(() => fetchOrders(true), POLL_MS);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(clock);
  }, []);

  const handleAction = async (order, fn) => {
    setBusyId(order.id);
    try {
      const updated = await adminOrderService[fn](order.id);
      setOrders((list) => {
        const next = list.map((o) => (o.id === updated.id ? updated : o));
        return next.filter((o) => KITCHEN_STATUSES.includes(o.status));
      });
      toast.success(`Order #${order.id} → ${updated.status.replace(/_/g, ' ').toLowerCase()}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update order');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-800"><ChefHat className="h-6 w-6 text-orange-500" /> Kitchen</h1>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <motion.span className="h-2 w-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            Live · {POLL_MS / 1000}s
          </span>
        </div>
        <button onClick={() => fetchOrders(false)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn't load the kitchen queue. Check that the backend is running on port 8080.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = orders.filter((o) => col.statuses.includes(o.status));
          return (
            <div key={col.key} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
              <div className={`mb-3 flex items-center justify-between rounded-xl bg-gradient-to-r ${col.accent} px-3 py-2 text-white`}>
                <span className="text-sm font-bold">{col.title}</span>
                <span className="rounded-full bg-white/25 px-2 text-xs font-bold">{items.length}</span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/70" />)
                ) : items.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">No orders</p>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((o) => (
                      <KitchenOrderCard key={o.id} order={o} now={now} action={col.action} busy={busyId === o.id} onAction={handleAction} />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
