import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShoppingCart, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { formatMoney } from '../utils/format';
import EmptyState from '../components/EmptyState';

export default function Checkout() {
  const { items, subtotal, refresh } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [applied, setApplied] = useState(null); // validation response when a coupon is active
  const [quote, setQuote] = useState(null);      // latest billing breakdown (base or with coupon)
  const [couponBusy, setCouponBusy] = useState(false);

  // Fetch a base billing quote (no coupon) on load / when subtotal changes.
  useEffect(() => {
    if (items.length === 0) return;
    let active = true;
    couponService
      .validate('', subtotal)
      .then((q) => active && !applied && setQuote(q))
      .catch(() => {});
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, items.length]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <EmptyState icon={ShoppingCart} title="Your cart is empty" message="Add items before checking out." />
        <div className="text-center">
          <Link to="/menu" className="btn-primary">Browse menu</Link>
        </div>
      </div>
    );
  }

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponBusy(true);
    try {
      const res = await couponService.validate(code, subtotal);
      if (res.valid) {
        setApplied(res);
        setQuote(res);
        toast.success(`${res.couponCode} applied — saved ${formatMoney(res.discountAmount)}`);
      } else {
        toast.error(res.message || 'Invalid coupon');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not validate coupon');
    } finally {
      setCouponBusy(false);
    }
  };

  const removeCoupon = async () => {
    setApplied(null);
    setCouponInput('');
    try {
      const q = await couponService.validate('', subtotal);
      setQuote(q);
    } catch {
      setQuote(null);
    }
    toast('Coupon removed');
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const order = await orderService.placeOrder({
        deliveryAddress: address.trim() || undefined,
        couponCode: applied?.couponCode || undefined,
      });
      await refresh();
      toast.success('Order placed!');
      navigate(`/orders/${order.id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold">Your items</h2>
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <span>
                {item.pizzaName} <span className="text-gray-400">× {item.quantity}</span>
              </span>
              <span className="font-medium">{formatMoney(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coupon */}
      <div className="card mb-6 p-5">
        <label className="mb-2 block font-semibold">Have a coupon?</label>
        {applied ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Check className="h-4 w-4" /> {applied.couponCode} applied · saved {formatMoney(applied.discountAmount)}
            </span>
            <button onClick={removeCoupon} className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-900">
              <X className="h-4 w-4" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="input pl-9 uppercase"
                placeholder="PIZZA10, FREEDEL, PARTY20…"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
              />
            </div>
            <button className="btn-outline" onClick={applyCoupon} disabled={couponBusy || !couponInput.trim()}>
              {couponBusy ? 'Checking…' : 'Apply'}
            </button>
          </div>
        )}
      </div>

      {/* Billing breakdown */}
      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold">Bill details</h2>
        <div className="space-y-1 text-sm">
          <Row label="Subtotal" value={formatMoney(quote ? quote.subtotal : subtotal)} />
          {quote && <Row label="GST (5%)" value={formatMoney(quote.gstAmount)} />}
          {quote && (
            <Row
              label="Delivery fee"
              value={quote.deliveryFee > 0 ? formatMoney(quote.deliveryFee) : 'Free'}
            />
          )}
          {quote && quote.discountAmount > 0 && (
            <Row label={`Discount${applied ? ` (${applied.couponCode})` : ''}`} value={`− ${formatMoney(quote.discountAmount)}`} highlight />
          )}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-base font-bold">
            <span>Grand total</span>
            <span>{formatMoney(quote ? quote.grandTotal : subtotal)}</span>
          </div>
        </div>
        {!quote && <p className="mt-2 text-xs text-gray-400">Calculating taxes and delivery…</p>}
      </div>

      <div className="card mb-6 p-5">
        <label className="mb-1 block font-semibold">Delivery address <span className="font-normal text-gray-400">(optional)</span></label>
        <textarea
          className="input min-h-[88px]"
          maxLength={255}
          placeholder="Flat / street / city…"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button className="btn-primary w-full" onClick={placeOrder} disabled={placing}>
        {placing ? 'Placing order…' : 'Place order'}
      </button>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? 'font-medium text-emerald-600' : 'font-medium'}>{value}</span>
    </div>
  );
}
