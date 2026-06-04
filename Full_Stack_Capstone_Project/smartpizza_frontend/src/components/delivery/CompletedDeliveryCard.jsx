import { motion } from 'framer-motion';
import { Banknote, CheckCircle2, MapPin } from 'lucide-react';
import { formatDateTime, formatMoney } from '../../utils/format';

export default function CompletedDeliveryCard({ delivery }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">Order #{delivery.orderId}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
          {delivery.paymentMethod && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${delivery.paymentMethod === 'COD' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {delivery.paymentMethod === 'COD' ? 'COD' : 'PREPAID'}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600">{delivery.customerName}</p>
        {delivery.paymentMethod === 'COD' && delivery.cashCollected && (
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <Banknote className="h-3.5 w-3.5" /> Cash collected
          </p>
        )}
        {delivery.deliveryAddress && (
          <p className="mt-1 flex items-start gap-1 text-xs text-gray-400">
            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {delivery.deliveryAddress}
          </p>
        )}
        {delivery.deliveredAt && <p className="mt-1 text-xs text-gray-400">{formatDateTime(delivery.deliveredAt)}</p>}
      </div>
      <span className="font-extrabold text-gray-900">{formatMoney(delivery.totalAmount)}</span>
    </motion.div>
  );
}
