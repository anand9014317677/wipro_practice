import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, CreditCard, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { formatMoney } from '../utils/format';
import EmptyState from '../components/EmptyState';

const METHODS = [
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'WALLET', label: 'Wallet' },
  { value: 'COD', label: 'Cash on Delivery' },
];

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [method, setMethod] = useState('UPI');
  const [step, setStep] = useState('select'); // select | processing | success | failed
  const [payment, setPayment] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    orderService
      .getOrderById(orderId)
      .then((o) => active && setOrder(o))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [orderId]);

  const startPayment = async () => {
    setBusy(true);
    try {
      const p = await paymentService.createPayment({ orderId: Number(orderId), method });
      setPayment(p);
      setStep(p.status === 'SUCCESS' ? 'success' : 'processing');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not start payment');
    } finally {
      setBusy(false);
    }
  };

  const completePayment = async (simulateFailure) => {
    setBusy(true);
    try {
      const result = await paymentService.verifyPayment({
        paymentId: payment.id,
        gatewayOrderId: payment.gatewayOrderId,
        transactionId: simulateFailure ? 'fail' : `txn_${Date.now()}`,
        signature: 'sig_demo',
      });
      setPayment(result);
      setStep(result.status === 'SUCCESS' ? 'success' : 'failed');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Verification failed');
      setStep('failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg justify-center px-4 py-20 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <EmptyState icon={CreditCard} title="Order not found" />
        <div className="text-center">
          <Link to="/orders" className="btn-outline">Back to orders</Link>
        </div>
      </div>
    );
  }

  const amount = payment?.totalAmount ?? order.totalAmount;

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Payment</h1>
      <p className="mb-6 text-sm text-gray-500">Order #{order.id}</p>

      <div className="card p-6">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-gray-500">Amount to pay</span>
          <span className="text-2xl font-bold text-primary-600">{formatMoney(amount)}</span>
        </div>

        {/* Already handled */}
        {step === 'select' && order.status !== 'PLACED' && (
          <div className="text-center">
            <ShieldCheck className="mx-auto mb-2 h-10 w-10 text-green-500" />
            <p className="font-medium">This order is already {order.status.toLowerCase().replace(/_/g, ' ')}.</p>
            <Link to={`/orders/${order.id}`} className="btn-outline mt-4">View order</Link>
          </div>
        )}

        {/* Method selection */}
        {step === 'select' && order.status === 'PLACED' && (
          <>
            <p className="mb-3 font-semibold">Choose a payment method</p>
            <div className="space-y-2">
              {METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    method === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.value}
                    checked={method === m.value}
                    onChange={() => setMethod(m.value)}
                    className="accent-primary-600"
                  />
                  <span className="font-medium">{m.label}</span>
                </label>
              ))}
            </div>
            <button className="btn-primary mt-6 w-full" onClick={startPayment} disabled={busy}>
              {busy ? 'Starting…' : `Pay ${formatMoney(amount)}`}
            </button>
          </>
        )}

        {/* Simulated gateway step (online methods) */}
        {step === 'processing' && (
          <div className="text-center">
            <p className="mb-1 font-semibold">Complete your payment</p>
            <p className="mb-5 text-sm text-gray-500">
              Gateway order <span className="font-mono">{payment?.gatewayOrderId}</span>
            </p>
            <div className="flex flex-col gap-3">
              <button className="btn-primary" onClick={() => completePayment(false)} disabled={busy}>
                {busy ? 'Verifying…' : 'Complete payment'}
              </button>
              <button className="btn-outline" onClick={() => completePayment(true)} disabled={busy}>
                Simulate failure
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-green-500" />
            <h2 className="text-xl font-bold">Payment successful</h2>
            <p className="mt-1 text-sm text-gray-500">Your order is confirmed.</p>
            <div className="mt-4 space-y-1 rounded-lg bg-gray-50 p-4 text-left text-sm">
              <Row label="Receipt" value={payment?.receiptNumber} />
              <Row label="Amount" value={formatMoney(payment?.totalAmount)} />
              <Row label="Method" value={payment?.method} />
              <Row label="Transaction" value={payment?.transactionId} />
            </div>
            <div className="mt-6 flex gap-3">
              <Link to={`/orders/${order.id}`} className="btn-primary flex-1">View order</Link>
              <Link to="/orders" className="btn-outline flex-1">My orders</Link>
            </div>
          </div>
        )}

        {/* Failure */}
        {step === 'failed' && (
          <div className="text-center">
            <XCircle className="mx-auto mb-3 h-14 w-14 text-red-500" />
            <h2 className="text-xl font-bold">Payment failed</h2>
            <p className="mt-1 text-sm text-gray-500">
              No money was charged. Your order is still pending — you can try again.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="btn-primary flex-1"
                onClick={() => {
                  setPayment(null);
                  setStep('select');
                }}
              >
                Try again
              </button>
              <Link to={`/orders/${order.id}`} className="btn-outline flex-1">Back to order</Link>
            </div>
          </div>
        )}
      </div>
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
