import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, MapPin, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { deliveryService } from '../services/deliveryService';
import { useAuth } from '../context/AuthContext';
import { deliveryStatusClass, formatMoney, prettyStatus } from '../utils/format';
import EmptyState from '../components/EmptyState';

// status -> the actions a delivery partner can take next
const NEXT_ACTIONS = {
  ASSIGNED: [
    { label: 'Accept', fn: 'accept', primary: true },
    { label: 'Reject', fn: 'reject', primary: false },
  ],
  ACCEPTED: [{ label: 'Ready for Pickup', fn: 'readyToPickup', primary: true }],
  READY_TO_PICKUP: [{ label: 'Out for Delivery', fn: 'outForDelivery', primary: true }],
  OUT_FOR_DELIVERY: [{ label: 'Mark Delivered', fn: 'delivered', primary: true }],
};

export default function DeliveryDashboard() {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';
  const isPartner = role === 'DELIVERY';

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // admin assign form
  const [assignForm, setAssignForm] = useState({ orderId: '', deliveryPartnerId: '', estimatedMinutes: '' });
  const [assigning, setAssigning] = useState(false);
  const [rec, setRec] = useState(null);

  const load = () => {
    setLoading(true);
    setError(false);
    deliveryService
      .getDeliveries()
      .then(setDeliveries)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const loadRec = () => {
    if (role !== 'ADMIN') return;
    deliveryService.getRecommendedPartner().then(setRec).catch(() => {});
  };

  useEffect(() => {
    load();
    loadRec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (delivery, fn) => {
    let reason;
    if (fn === 'reject') {
      reason = window.prompt('Reason for rejecting (optional):');
      if (reason === null) return; // cancelled
    }
    setBusyId(delivery.id);
    try {
      const updated =
        fn === 'reject'
          ? await deliveryService.reject(delivery.id, reason)
          : await deliveryService[fn](delivery.id);
      setDeliveries((ds) => ds.map((d) => (d.id === updated.id ? updated : d)));
      toast.success(fn === 'collectCash' ? 'Cash collected' : `Marked ${prettyStatus(updated.status).toLowerCase()}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssigning(true);
    try {
      await deliveryService.assign({
        orderId: Number(assignForm.orderId),
        deliveryPartnerId: Number(assignForm.deliveryPartnerId),
        estimatedMinutes: assignForm.estimatedMinutes ? Number(assignForm.estimatedMinutes) : undefined,
      });
      toast.success('Delivery assigned');
      setAssignForm({ orderId: '', deliveryPartnerId: '', estimatedMinutes: '' });
      load();
      loadRec();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not assign');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">{isAdmin ? 'All deliveries' : 'My deliveries'}</h1>
      <p className="mb-6 text-sm text-gray-500">
        {isAdmin ? 'Assign orders and monitor every delivery.' : 'Accept assignments and update their status.'}
      </p>

      {/* Admin: assign form */}
      {isAdmin && (
        <form onSubmit={handleAssign} className="card mb-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-4">
          <input
            className="input" type="number" placeholder="Order ID" required
            value={assignForm.orderId}
            onChange={(e) => setAssignForm((f) => ({ ...f, orderId: e.target.value }))}
          />
          <input
            className="input" type="number" placeholder="Partner user ID" required
            value={assignForm.deliveryPartnerId}
            onChange={(e) => setAssignForm((f) => ({ ...f, deliveryPartnerId: e.target.value }))}
          />
          <input
            className="input" type="number" placeholder="ETA mins (opt.)"
            value={assignForm.estimatedMinutes}
            onChange={(e) => setAssignForm((f) => ({ ...f, estimatedMinutes: e.target.value }))}
          />
          <button className="btn-primary" disabled={assigning}>
            {assigning ? 'Assigning…' : 'Assign delivery'}
          </button>
        </form>
      )}

      {isAdmin && rec && rec.candidates && rec.candidates.length > 0 && (
        <div className="card mb-6 p-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Recommended partner</h2>
            <span className="text-xs text-gray-400">~{rec.estimatedTravelMinutes} min est. travel</span>
          </div>
          <p className="mb-3 text-xs text-gray-400">Best available partner based on active workload.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {rec.candidates.map((c) => (
              <button
                key={c.partnerId}
                type="button"
                onClick={() => setAssignForm((f) => ({ ...f, deliveryPartnerId: String(c.partnerId) }))}
                className={`rounded-xl border p-3 text-left transition ${c.recommended ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  {c.recommended && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">Recommended</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  #{c.partnerId} · {c.activeDeliveries} active deliver{c.activeDeliveries === 1 ? 'y' : 'ies'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : error ? (
        <EmptyState icon={Truck} title="Couldn't load deliveries" />
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No deliveries yet"
          message={isAdmin ? 'Assign a CONFIRMED order above.' : 'Assignments from admin will appear here.'}
        />
      ) : (
        <div className="space-y-3">
          {deliveries.map((d) => {
            const isCod = d.paymentMethod === 'COD';
            // COD orders must collect cash while OUT_FOR_DELIVERY before they can be delivered.
            const needCash = isPartner && isCod && d.status === 'OUT_FOR_DELIVERY' && !d.cashCollected;
            const actions = needCash
              ? [{ label: 'Collect Cash', fn: 'collectCash', primary: true }]
              : isPartner
                ? NEXT_ACTIONS[d.status] || []
                : [];
            return (
              <div key={d.id} className="card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Order #{d.orderId}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${deliveryStatusClass(d.status)}`}>
                        {prettyStatus(d.status)}
                      </span>
                      {d.paymentMethod && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isCod ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isCod ? 'COD' : 'PREPAID'}
                        </span>
                      )}
                      {isCod && d.cashCollected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <Banknote className="h-3.5 w-3.5" /> Cash collected
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {d.customerName} · {formatMoney(d.totalAmount)}
                    </p>
                    {d.deliveryAddress && (
                      <p className="mt-1 flex items-start gap-1 text-sm text-gray-500">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" /> {d.deliveryAddress}
                      </p>
                    )}
                    {isAdmin && (
                      <p className="mt-1 text-xs text-gray-400">Partner: {d.deliveryPartnerName}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {actions.map((a) => (
                      <button
                        key={a.fn}
                        className={`${a.primary ? 'btn-primary' : 'btn-outline'} px-3 py-1.5 text-sm`}
                        onClick={() => handleAction(d, a.fn)}
                        disabled={busyId === d.id}
                      >
                        {a.label}
                      </button>
                    ))}
                    <Link to={`${isAdmin ? '/admin' : '/delivery'}/track/${d.orderId}`} className="btn-outline px-3 py-1.5 text-sm">
                      Track
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
