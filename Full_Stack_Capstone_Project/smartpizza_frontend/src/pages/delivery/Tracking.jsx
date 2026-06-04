import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { deliveryService } from '../../services/deliveryService';
import TrackingCard from '../../components/delivery/TrackingCard';
import EmptyState from '../../components/EmptyState';

const POLL_MS = 5000;
const ACTIVE = ['ASSIGNED', 'ACCEPTED', 'READY_TO_PICKUP', 'OUT_FOR_DELIVERY'];

export default function Tracking() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchActive = async () => {
    try {
      const all = await deliveryService.getDeliveries();
      setDeliveries((all || []).filter((d) => ACTIVE.includes(d.status)));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
    const t = setInterval(fetchActive, POLL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-4 text-xl font-extrabold text-gray-900">Live tracking</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />)}
        </div>
      ) : error ? (
        <EmptyState icon={MapPin} title="Couldn't load deliveries" message="Pull to refresh in a moment." />
      ) : deliveries.length === 0 ? (
        <EmptyState icon={MapPin} title="No active deliveries" message="Accepted deliveries you're working on will appear here." />
      ) : (
        <div className="space-y-3">
          {deliveries.map((d) => (
            <TrackingCard
              key={d.id}
              delivery={d}
              expanded={expandedId === d.id}
              onToggle={() => setExpandedId((cur) => (cur === d.id ? null : d.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
