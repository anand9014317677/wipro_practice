import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Truck } from 'lucide-react';
import { formatMoney, prettyStatus, statusClass } from '../../utils/format';

const pad = (n) => String(n).padStart(2, '0');
const elapsedLabel = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
const elapsedColor = (s) => (s >= 1200 ? 'text-red-600' : s >= 600 ? 'text-amber-600' : 'text-slate-500');

export default function KitchenOrderCard({ order, now, onAction, busy, action }) {
  const seconds = Math.max(0, Math.floor((now - new Date(order.createdAt).getTime()) / 1000));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-slate-800">Order #{order.id}</p>
          <p className="text-sm text-slate-500">{order.customerName || 'Customer'}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(order.status)}`}>
          <motion.span className="h-1.5 w-1.5 rounded-full bg-current" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          {prettyStatus(order.status)}
        </span>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {order.items?.map((it) => (
          <li key={it.id} className="flex justify-between">
            <span>{it.pizzaName} <span className="text-slate-400">× {it.quantity}</span></span>
            <span className="text-slate-400">{formatMoney(it.lineTotal)}</span>
          </li>
        ))}
      </ul>

      {order.deliveryAddress && (
        <p className="mt-2 flex items-start gap-1 text-xs text-slate-400">
          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {order.deliveryAddress}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="font-extrabold text-slate-800">{formatMoney(order.totalAmount)}</span>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${elapsedColor(seconds)}`}>
          <Clock className="h-3.5 w-3.5" /> {elapsedLabel(seconds)}
        </span>
      </div>

      {action ? (
        <button
          onClick={() => onAction(order, action.fn)}
          disabled={busy}
          className="mt-3 w-full rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 active:scale-95 disabled:opacity-50"
        >
          {busy ? 'Working…' : action.label}
        </button>
      ) : (
        <Link
          to="/admin/assign-delivery"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
        >
          <Truck className="h-4 w-4" /> Ready for Pickup
        </Link>
      )}
    </motion.div>
  );
}
