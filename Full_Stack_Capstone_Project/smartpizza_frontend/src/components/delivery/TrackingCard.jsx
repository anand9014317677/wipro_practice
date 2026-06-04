import { AnimatePresence, motion } from 'framer-motion';
import { Banknote, ChevronDown, Clock, MapPin } from 'lucide-react';
import DeliveryTimeline from './DeliveryTimeline';
import { deliveryStatusClass, formatDateTime, formatMoney, prettyStatus } from '../../utils/format';

export default function TrackingCard({ delivery, expanded, onToggle }) {
  const times = {
    ASSIGNED: delivery.assignedAt,
    ACCEPTED: delivery.acceptedAt,
    DELIVERED: delivery.deliveredAt,
  };

  return (
    <motion.div layout className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">Order #{delivery.orderId}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${deliveryStatusClass(delivery.status)}`}>
              {prettyStatus(delivery.status)}
            </span>
            {delivery.paymentMethod && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${delivery.paymentMethod === 'COD' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {delivery.paymentMethod === 'COD' && (
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
                    <Banknote className="h-3 w-3" />
                  </motion.span>
                )}
                {delivery.paymentMethod === 'COD' ? (delivery.cashCollected ? 'COD · collected' : 'COD') : 'PREPAID'}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">{delivery.customerName}</p>
          {delivery.deliveryAddress && (
            <p className="mt-1 flex items-start gap-1 text-xs text-gray-400">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {delivery.deliveryAddress}
            </p>
          )}
          {delivery.estimatedDeliveryTime && (
            <p className="mt-1 flex items-center gap-1 text-xs text-teal-600">
              <Clock className="h-3.5 w-3.5" /> ETA {formatDateTime(delivery.estimatedDeliveryTime)}
            </p>
          )}
          {delivery.status !== 'DELIVERED' && delivery.estimatedMinutesRemaining > 0 && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
              <Clock className="h-3.5 w-3.5" /> ~{delivery.estimatedMinutesRemaining} mins remaining
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-extrabold text-gray-900">{formatMoney(delivery.totalAmount)}</span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }}><ChevronDown className="h-5 w-5 text-gray-400" /></motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 pb-4"
          >
            <DeliveryTimeline status={delivery.status} times={times} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
