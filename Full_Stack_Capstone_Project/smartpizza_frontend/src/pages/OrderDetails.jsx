import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, IndianRupee, CheckCircle2, CreditCard, FileText, Package, RefreshCw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { useCart } from '../context/CartContext';
import { formatDateTime, formatMoney, prettyStatus, statusClass } from '../utils/format';
import EmptyState from '../components/EmptyState';
import OrderTimeline from '../components/customer/OrderTimeline';
import EtaChip from '../components/customer/EtaChip';

const CANCELLABLE = ['PLACED', 'CONFIRMED'];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refresh: refreshCart } = useCart();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [invoiceBusy, setInvoiceBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [o, track] = await Promise.all([
        orderService.getOrderById(id),
        orderService.trackOrder(id),
      ]);
      setOrder(o);
      setTimeline(track.timeline || []);
      // Payment is best-effort: an unpaid order may not have one yet.
      try {
        const history = await paymentService.getHistory();
        const mine = (history || [])
          .filter((p) => String(p.orderId) === String(id))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPayment(mine[0] || null);
      } catch {
        setPayment(null);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Lightweight live refresh so status + ETA update without a full reload spinner.
  const refreshLite = useCallback(async () => {
    try {
      const [o, track] = await Promise.all([
        orderService.getOrderById(id),
        orderService.trackOrder(id),
      ]);
      setOrder(o);
      setTimeline(track.timeline || []);
    } catch {
      /* transient — keep showing the last good state */
    }
  }, [id]);

  useEffect(() => {
    const status = order?.status;
    if (!status || status === 'DELIVERED' || status === 'CANCELLED') return undefined;
    const t = setInterval(refreshLite, 20000);
    return () => clearInterval(t);
  }, [order?.status, refreshLite]);

  const isPrepaid = payment && payment.method && payment.method !== 'COD';
  const wasPaid = payment && payment.status === 'SUCCESS';
  const isRefunded = payment && payment.status === 'REFUNDED';
  // Invoice available once payment is settled (online success or COD) — also after refund.
  const canInvoice = payment && ['SUCCESS', 'REFUNDED'].includes(payment.status);

  const handleConfirmCancel = async () => {
    setBusy(true);
    try {
      await orderService.cancelOrder(id);
      if (isPrepaid && wasPaid) {
        toast.success('Order cancelled — refund initiated', { icon: '💸' });
      } else {
        toast.success('Order cancelled');
      }
      setConfirmOpen(false);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not cancel order');
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setInvoiceBusy(true);
    try {
      const blob = await paymentService.getInvoice(order.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    } catch {
      toast.error('Could not download invoice');
    } finally {
      setInvoiceBusy(false);
    }
  };

  const handleReorder = async () => {
    setBusy(true);
    try {
      await orderService.reorder(id);
      await refreshCart();
      toast.success('Items added to your cart');
      navigate('/cart');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not reorder');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState icon={Package} title="Order not found" />
        <div className="text-center">
          <Link to="/orders" className="btn-outline">Back to orders</Link>
        </div>
      </div>
    );
  }

  const cancellable = CANCELLABLE.includes(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusClass(order.status)}`}>
          {prettyStatus(order.status)}
        </span>
      </div>
      <p className="mb-6 text-sm text-gray-500">Placed {formatDateTime(order.createdAt)}</p>

      {/* Refund banner for cancelled prepaid orders */}
      {order.status === 'CANCELLED' && (isRefunded || (isPrepaid && wasPaid)) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <IndianRupee className="h-5 w-5 flex-shrink-0 text-emerald-600" />
          <div className="text-sm">
            <p className="font-semibold text-emerald-800">{isRefunded ? 'Refund processed' : 'Refund initiated'}</p>
            <p className="text-emerald-700">
              {formatMoney(payment.refundedAmount || payment.totalAmount)} to your original payment method
              {payment.method ? ` (${payment.method})` : ''}.
            </p>
          </div>
        </motion.div>
      )}

      {/* Items */}
      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold">Items</h2>
        <ul className="divide-y divide-gray-100">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                {it.pizzaName} <span className="text-gray-400">× {it.quantity}</span>
                {it.size ? <span className="text-gray-400"> · {it.size}</span> : null}
              </span>
              <span className="font-medium">{formatMoney(it.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm">
          <Row label="Subtotal" value={formatMoney(order.subtotal)} />
          <Row label="GST (5%)" value={formatMoney(order.tax)} />
          <Row label="Delivery fee" value={order.deliveryFee > 0 ? formatMoney(order.deliveryFee) : 'Free'} />
          {order.discountAmount > 0 && (
            <Row label={`Discount${order.couponCode ? ` (${order.couponCode})` : ''}`} value={`− ${formatMoney(order.discountAmount)}`} />
          )}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatMoney(order.totalAmount)}</span>
          </div>
        </div>

        {payment && (
          <p className="mt-3 text-xs text-gray-500">
            Payment: <span className="font-medium text-gray-700">{isPrepaid ? 'Prepaid' : 'Cash on Delivery'}</span>
            {payment.method ? ` · ${payment.method}` : ''} · {prettyStatus(payment.status)}
          </p>
        )}

        {order.deliveryAddress && (
          <p className="mt-4 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Deliver to: </span>
            {order.deliveryAddress}
          </p>
        )}
      </div>

      {/* ETA */}
      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.estimatedMinutesRemaining > 0 && (
        <div className="mb-4">
          <EtaChip minutes={order.estimatedMinutesRemaining} />
        </div>
      )}

      {/* Timeline */}
      <div className="mb-6">
        <OrderTimeline current={order.status} history={timeline} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {order.status === 'PLACED' && (
          <Link to={`/payment/${order.id}`} className="btn-primary">
            <CreditCard className="h-4 w-4" /> Pay now
          </Link>
        )}
        {cancellable && (
          <button className="btn-outline" onClick={() => setConfirmOpen(true)} disabled={busy}>
            <XCircle className="h-4 w-4" /> Cancel order
          </button>
        )}
        <button className="btn-outline" onClick={handleReorder} disabled={busy}>
          <RefreshCw className="h-4 w-4" /> Reorder
        </button>
        {canInvoice && (
          <button className="btn-outline" onClick={handleDownloadInvoice} disabled={invoiceBusy}>
            <FileText className="h-4 w-4" /> {invoiceBusy ? 'Preparing…' : 'Download Invoice'}
          </button>
        )}
        {order.status === 'DELIVERED' && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Delivered
          </span>
        )}
      </div>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !busy && setConfirmOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900">Cancel this order?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to cancel order #{order.id}?
                {isPrepaid && wasPaid
                  ? ' Your payment will be refunded to the original method.'
                  : ' This cannot be undone.'}
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button className="btn-outline" onClick={() => setConfirmOpen(false)} disabled={busy}>
                  Keep order
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  onClick={handleConfirmCancel}
                  disabled={busy}
                >
                  {busy ? 'Cancelling…' : 'Cancel order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
