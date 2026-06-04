import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Pizza, Plus, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { pizzaService } from '../services/pizzaService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

export default function PizzaDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [pizza, setPizza] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    pizzaService
      .getPizzaById(id)
      .then((res) => active && setPizza(res))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      toast('Sign in to add items to your cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addItem(pizza.id, qty);
      toast.success(`${qty} × ${pizza.name} added to cart`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-7 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !pizza) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState icon={Pizza} title="Pizza not found" message="It may have been removed." />
        <div className="text-center">
          <Link to="/menu" className="btn-outline">Back to menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/menu" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to menu
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
          {pizza.imageUrl ? (
            <img src={pizza.imageUrl} alt={pizza.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <Pizza className="h-16 w-16" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                pizza.veg ? 'border-green-600' : 'border-red-600'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${pizza.veg ? 'bg-green-600' : 'bg-red-600'}`} />
            </span>
            <span className="text-sm text-gray-500">{pizza.categoryName}</span>
          </div>

          <h1 className="mt-2 text-3xl font-bold">{pizza.name}</h1>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-2xl font-bold text-primary-600">₹{Number(pizza.price).toFixed(2)}</span>
            {pizza.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-sm text-amber-600">
                <Star className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                {pizza.rating}
              </span>
            )}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{pizza.size}</span>
          </div>

          {pizza.description && <p className="mt-4 text-gray-600">{pizza.description}</p>}

          {pizza.available === false ? (
            <p className="mt-6 font-medium text-red-600">Currently unavailable</p>
          ) : (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  className="px-3 py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  className="px-3 py-2 text-gray-600 hover:text-primary-600"
                  onClick={() => setQty((q) => Math.min(50, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button className="btn-primary" onClick={handleAdd} disabled={adding}>
                <ShoppingCart className="h-4 w-4" />
                {adding ? 'Adding…' : 'Add to cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
