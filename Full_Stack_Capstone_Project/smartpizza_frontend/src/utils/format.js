export const formatMoney = (v) => `₹${Number(v ?? 0).toFixed(2)}`;

export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

export const prettyStatus = (s) => (s ? s.replace(/_/g, ' ') : '');

const ORDER_STATUS_CLASSES = {
  PLACED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  ACCEPTED: 'bg-violet-100 text-violet-700',
  PREPARING: 'bg-amber-100 text-amber-700',
  BAKED: 'bg-orange-100 text-orange-700',
  ASSIGNED: 'bg-sky-100 text-sky-700',
  READY_TO_PICKUP: 'bg-cyan-100 text-cyan-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};
export const statusClass = (status) => ORDER_STATUS_CLASSES[status] || 'bg-gray-100 text-gray-700';

const PAYMENT_STATUS_CLASSES = {
  PENDING: 'bg-amber-100 text-amber-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-indigo-100 text-indigo-700',
};
export const paymentStatusClass = (status) => PAYMENT_STATUS_CLASSES[status] || 'bg-gray-100 text-gray-700';

const DELIVERY_STATUS_CLASSES = {
  ASSIGNED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-indigo-100 text-indigo-700',
  READY_TO_PICKUP: 'bg-cyan-100 text-cyan-700',
  PREPARING: 'bg-amber-100 text-amber-700',
  BAKED: 'bg-orange-100 text-orange-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};
export const deliveryStatusClass = (status) => DELIVERY_STATUS_CLASSES[status] || 'bg-gray-100 text-gray-700';
