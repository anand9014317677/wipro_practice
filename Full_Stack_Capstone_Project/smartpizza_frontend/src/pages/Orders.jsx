import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { formatDateTime, formatMoney, prettyStatus, statusClass } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const { refresh: refreshCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reordering, setReordering] = useState(null);

  useEffect(() => {
    let active = true;
    orderService
      .getMyOrders()
      .then((res) => active && setOrders(res))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleReorder = async (id) => {
    setReordering(id);
    try {
      await orderService.reorder(id);
      await refreshCart();
      toast.success('Items added to your cart');
      navigate('/cart');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not reorder');
    } finally {
      setReordering(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState icon={Package} title="Couldn't load your orders" message="Please try again." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">My orders</h1>
        <EmptyState icon={Package} title="No orders yet" message="Your placed orders will show up here." />
        <div className="text-center">
          <Link to="/menu" className="btn-primary">Browse menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">Order #{o.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(o.status)}`}>
                  {prettyStatus(o.status)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formatDateTime(o.createdAt)} · {o.items?.length || 0} item(s) · {formatMoney(o.totalAmount)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/orders/${o.id}`} className="btn-outline px-3 py-1.5 text-sm">Details</Link>
              <button
                className="btn-primary px-3 py-1.5 text-sm"
                onClick={() => handleReorder(o.id)}
                disabled={reordering === o.id}
              >
                <RefreshCw className="h-4 w-4" />
                {reordering === o.id ? 'Adding…' : 'Reorder'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
