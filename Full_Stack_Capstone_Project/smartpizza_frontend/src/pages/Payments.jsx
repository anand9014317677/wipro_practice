import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { formatDateTime, formatMoney, paymentStatusClass, prettyStatus } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    paymentService
      .getHistory()
      .then((res) => active && setPayments(res))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState icon={Receipt} title="Couldn't load payments" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Payments</h1>
        <EmptyState icon={Receipt} title="No payments yet" message="Your payment history will appear here." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Payments</h1>
      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="card flex items-center justify-between p-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{p.receiptNumber}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${paymentStatusClass(p.status)}`}>
                  {prettyStatus(p.status)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                <Link to={`/orders/${p.orderId}`} className="hover:text-primary-600">Order #{p.orderId}</Link>
                {' · '}{p.method}{' · '}{formatDateTime(p.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatMoney(p.totalAmount)}</p>
              {p.refundedAmount > 0 && (
                <p className="text-xs text-indigo-600">Refunded {formatMoney(p.refundedAmount)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
