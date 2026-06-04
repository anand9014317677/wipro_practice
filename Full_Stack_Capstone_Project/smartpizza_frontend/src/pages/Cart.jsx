import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Minus, Pizza, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

// mirrors backend defaults (app.order.tax-rate=0.05, fee ₹40, free over ₹500) for an ESTIMATE only
const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;
const FREE_OVER = 500;
const money = (v) => `₹${Number(v || 0).toFixed(2)}`;

export default function Cart() {
  const { items, subtotal, loading, refresh, updateItem, removeItem, clear } = useCart();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeQty = async (item, newQty) => {
    if (newQty < 1 || newQty > 50) return;
    setBusyId(item.id);
    try {
      await updateItem(item.id, newQty);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update quantity');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item) => {
    setBusyId(item.id);
    try {
      await removeItem(item.id);
      toast.success('Removed from cart');
    } catch {
      toast.error('Could not remove item');
    } finally {
      setBusyId(null);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await clear();
      toast.success('Cart cleared');
    } catch {
      toast.error('Could not clear cart');
    } finally {
      setClearing(false);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl justify-center px-4 py-20 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-extrabold">Your cart</h1>
        <EmptyState icon={ShoppingCart} title="Your cart is empty" message="Add some pizzas to get started." />
        <div className="text-center">
          <Link to="/menu" className="inline-flex rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600">Browse menu</Link>
        </div>
      </div>
    );
  }

  const estTax = subtotal * TAX_RATE;
  const estDelivery = subtotal >= FREE_OVER ? 0 : DELIVERY_FEE;
  const estTotal = subtotal + estTax + estDelivery;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-28 lg:pb-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Your cart</h1>
        <button className="text-sm font-medium text-gray-500 hover:text-red-600" onClick={handleClear} disabled={clearing}>
          {clearing ? 'Clearing…' : 'Clear cart'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* items */}
        <div className="space-y-3 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {it.imageUrl ? (
                    <img src={it.imageUrl} alt={it.pizzaName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-orange-200"><Pizza className="h-7 w-7" /></div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-900">{it.pizzaName}</p>
                  <p className="text-sm text-gray-500">{money(it.unitPrice)}{it.size ? ` · ${it.size}` : ''}</p>
                </div>

                <div className="flex items-center rounded-xl border border-gray-200">
                  <button className="px-2.5 py-2 text-gray-600 hover:text-orange-600 disabled:opacity-40"
                    onClick={() => changeQty(it, it.quantity - 1)} disabled={busyId === it.id || it.quantity <= 1} aria-label="Decrease">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{it.quantity}</span>
                  <button className="px-2.5 py-2 text-gray-600 hover:text-orange-600 disabled:opacity-40"
                    onClick={() => changeQty(it, it.quantity + 1)} disabled={busyId === it.id || it.quantity >= 50} aria-label="Increase">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <motion.div key={it.lineTotal} initial={{ scale: 1.15, color: '#ea580c' }} animate={{ scale: 1, color: '#111827' }}
                  className="w-20 text-right font-extrabold">
                  {money(it.lineTotal)}
                </motion.div>

                <button className="text-gray-400 hover:text-red-600 disabled:opacity-40" onClick={() => remove(it)} disabled={busyId === it.id} aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* summary */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Order summary</h2>

              {/* coupon UI */}
              <div className="mb-4 flex overflow-hidden rounded-xl border border-dashed border-orange-300 bg-orange-50">
                <span className="flex items-center pl-3 text-orange-500"><Tag className="h-4 w-4" /></span>
                <input
                  value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Coupon code" className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-orange-300"
                />
                <button onClick={() => toast('Coupons are applied at checkout — coming soon!')}
                  className="px-3 text-sm font-semibold text-orange-600 hover:text-orange-700">Apply</button>
              </div>

              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={money(subtotal)} />
                <Row label="Tax (est. 5%)" value={money(estTax)} muted />
                <Row label="Delivery (est.)" value={estDelivery === 0 ? 'Free' : money(estDelivery)} muted />
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-base font-extrabold">
                  <span>Estimated total</span>
                  <motion.span key={estTotal} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>{money(estTotal)}</motion.span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">Final tax & delivery are confirmed at checkout.</p>

              <button onClick={() => navigate('/checkout')}
                className="mt-5 hidden w-full rounded-xl bg-orange-500 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 lg:block">
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* sticky mobile checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Estimated total</p>
            <p className="text-lg font-extrabold">{money(estTotal)}</p>
          </div>
          <button onClick={() => navigate('/checkout')} className="flex-1 rounded-xl bg-orange-500 py-3 text-center font-bold text-white">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={muted ? 'text-gray-600' : 'font-medium'}>{value}</span>
    </div>
  );
}
