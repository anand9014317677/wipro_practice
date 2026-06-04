import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { deliveryService } from '../../services/deliveryService';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import { formatDateTime, formatMoney } from '../../utils/format';

const POLL_MS = 5000;
const STATUS_FILTERS = ['ALL', 'ASSIGNED', 'ACCEPTED', 'PREPARING', 'BAKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED'];

export default function LiveOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [newCount, setNewCount] = useState(0);
  const seenIds = useRef(null);
  const firstLoad = useRef(true);

  const fetchOrders = async (announce) => {
    try {
      const data = await deliveryService.getDeliveries();
      setRows(data || []);
      const ids = new Set((data || []).map((d) => d.id));
      if (announce && seenIds.current) {
        const fresh = [...ids].filter((id) => !seenIds.current.has(id)).length;
        if (fresh > 0) {
          setNewCount((c) => c + fresh);
          toast.success(`${fresh} new delivery${fresh > 1 ? 'ies' : ''} came in`, { icon: '🛎️' });
        }
      }
      seenIds.current = ids;
    } catch {
      // keep showing last good data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    const t = setInterval(() => fetchOrders(true), POLL_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { firstLoad.current = false; }, []);

  let view = filter === 'ALL' ? rows : rows.filter((r) => r.status === filter);
  view = [...view].sort((a, b) => {
    if (sort === 'amount') return Number(b.totalAmount || 0) - Number(a.totalAmount || 0);
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  const columns = [
    { key: 'orderId', header: 'Order', render: (r) => <Link to={`/admin/track/${r.orderId}`} className="font-semibold text-indigo-600 hover:underline">#{r.orderId}</Link> },
    { key: 'customerName', header: 'Customer', render: (r) => r.customerName || '—' },
    { key: 'orderStatus', header: 'Order', render: (r) => <StatusBadge value={r.orderStatus} kind="order" /> },
    { key: 'status', header: 'Delivery', render: (r) => <StatusBadge value={r.status} kind="delivery" /> },
    { key: 'partner', header: 'Partner', render: (r) => r.deliveryPartnerName || <span className="text-slate-400">—</span> },
    { key: 'totalAmount', header: 'Amount', render: (r) => <span className="font-semibold">{formatMoney(r.totalAmount)}</span> },
    { key: 'createdAt', header: 'Placed', className: 'text-slate-500', render: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold text-slate-800">Live Orders</h1>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <motion.span className="h-2 w-2 rounded-full bg-emerald-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            Live · {POLL_MS / 1000}s
          </span>
          {newCount > 0 && (
            <button onClick={() => setNewCount(0)} className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
              <Bell className="h-3 w-3" /> {newCount} new
            </button>
          )}
        </div>
        <button onClick={() => fetchOrders(false)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? 'bg-slate-800 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm">
          <span className="text-slate-400">Sort</span>
          <select className="bg-transparent font-medium outline-none" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="amount">Amount</option>
          </select>
        </label>
      </div>

      <DataTable columns={columns} rows={view} loading={loading} emptyText="No orders match this filter yet." />
    </div>
  );
}
