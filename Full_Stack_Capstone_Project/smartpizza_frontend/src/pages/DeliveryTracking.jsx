import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Truck } from 'lucide-react';
import { deliveryService } from '../services/deliveryService';
import { deliveryStatusClass, formatDateTime, prettyStatus } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function DeliveryTracking() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    deliveryService
      .track(orderId)
      .then((res) => active && setData(res))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <EmptyState icon={Truck} title="No delivery found for this order" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/delivery" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to deliveries
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Delivery · Order #{data.orderId}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${deliveryStatusClass(data.deliveryStatus)}`}>
          {prettyStatus(data.deliveryStatus)}
        </span>
      </div>

      <div className="card mb-6 p-5 text-sm text-gray-600">
        {data.deliveryPartnerName && <p><span className="font-medium text-gray-700">Partner:</span> {data.deliveryPartnerName}</p>}
        {data.deliveryAddress && <p className="mt-1"><span className="font-medium text-gray-700">Address:</span> {data.deliveryAddress}</p>}
        {data.estimatedDeliveryTime && (
          <p className="mt-1 flex items-center gap-1">
            <Clock className="h-4 w-4" /> ETA: {formatDateTime(data.estimatedDeliveryTime)}
          </p>
        )}
        {data.actualDeliveryTime && (
          <p className="mt-1 text-green-600">Delivered at {formatDateTime(data.actualDeliveryTime)}</p>
        )}
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-semibold">Timeline</h2>
        {(!data.timeline || data.timeline.length === 0) ? (
          <p className="text-sm text-gray-500">No updates yet.</p>
        ) : (
          <ol className="relative ml-2 border-l border-gray-200">
            {data.timeline.map((t, i) => (
              <li key={i} className="mb-5 ml-4 last:mb-0">
                <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary-500" />
                <p className="text-sm font-medium">{prettyStatus(t.status)}</p>
                {t.note && <p className="text-xs text-gray-500">{t.note}</p>}
                <p className="text-xs text-gray-400">{formatDateTime(t.changedAt)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
