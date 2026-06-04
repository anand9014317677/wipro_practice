import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { pizzaService } from '../services/pizzaService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/customer/FoodCard';
import { container, item } from '../components/customer/Reveal';
import { PizzaCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: 'name,asc', label: 'Name (A–Z)' },
  { value: 'price,asc', label: 'Price ↑' },
  { value: 'price,desc', label: 'Price ↓' },
  { value: 'rating,desc', label: 'Top rated' },
];
const VEG_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'veg', label: 'Veg' },
  { value: 'nonveg', label: 'Non-veg' },
];

export default function Menu() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const debouncedName = useDebounce(name, 400);
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [veg, setVeg] = useState('all');
  const [sort, setSort] = useState('name,asc');
  const [page, setPage] = useState(0);

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => { setPage(0); }, [debouncedName, categoryId, veg, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    const params = { page, size: PAGE_SIZE, sort };
    if (debouncedName) params.name = debouncedName;
    if (categoryId) params.categoryId = categoryId;
    if (veg !== 'all') params.veg = veg === 'veg';
    pizzaService
      .searchPizzas(params)
      .then((res) => active && setData(res))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [debouncedName, categoryId, veg, sort, page]);

  const handleAdd = async (pizza) => {
    if (!isAuthenticated) {
      toast('Sign in to add items to your cart');
      navigate('/customer/login');
      return;
    }
    try {
      await addItem(pizza.id, 1);
      toast.success(`${pizza.name} added to cart`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not add to cart');
    }
  };

  const pizzas = data?.content || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* header + search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Our Menu</h1>
          <p className="text-sm text-gray-500">Freshly baked, AI-curated favorites.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            placeholder="Search pizzas…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      {/* category chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={categoryId === ''} onClick={() => setCategoryId('')}>All</Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={String(categoryId) === String(c.id)} onClick={() => setCategoryId(String(c.id))}>
            {c.name}
          </Chip>
        ))}
      </div>

      {/* veg toggle + sort */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
          {VEG_OPTIONS.map((v) => (
            <button
              key={v.value}
              onClick={() => setVeg(v.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                veg === v.value ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <select className="bg-transparent font-medium outline-none" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>

      {/* results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <PizzaCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <EmptyState icon={UtensilsCrossed} title="Couldn't load the menu" message="Make sure the backend is running on port 8080, then refresh." />
      ) : pizzas.length === 0 ? (
        <EmptyState title="No pizzas match your filters" message="Try clearing the search or filters." />
      ) : (
        <>
          <motion.div
            variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {pizzas.map((p) => (
              <motion.div key={p.id} variants={item}>
                <FoodCard pizza={p} onAdd={handleAdd} to={`/menu/${p.id}`} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              disabled={data.first} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {data.page + 1} of {Math.max(1, data.totalPages)} · {data.totalElements} items
            </span>
            <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              disabled={data.last} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-black text-white shadow' : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600'
      }`}
    >
      {children}
    </button>
  );
}
