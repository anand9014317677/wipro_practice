import { deliveryStatusClass, paymentStatusClass, prettyStatus, statusClass } from '../../utils/format';

const PICKER = { delivery: deliveryStatusClass, order: statusClass, payment: paymentStatusClass };

export default function StatusBadge({ value, kind = 'delivery' }) {
  if (!value) return <span className="text-gray-400">—</span>;
  const cls = (PICKER[kind] || statusClass)(value);
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {prettyStatus(value)}
    </span>
  );
}
