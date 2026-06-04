import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Clock, Flame, Percent, Pizza, Quote, ShieldCheck, Sparkles, Star, Truck, UtensilsCrossed,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { pizzaService } from '../services/pizzaService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import FoodCard from '../components/customer/FoodCard';
import { Reveal } from '../components/customer/Reveal';
import { PizzaCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const OFFERS = [
  { icon: Percent, title: '50% OFF', sub: 'on your first order — code FIRST50', from: 'from-orange-500', to: 'to-amber-500' },
  { icon: Truck, title: 'Free delivery', sub: 'on orders above ₹500', from: 'from-rose-500', to: 'to-orange-500' },
  { icon: Flame, title: 'Combo deals', sub: 'family packs starting ₹499', from: 'from-amber-500', to: 'to-yellow-500' },
];

const TESTIMONIALS = [
  { name: 'Aarav S.', text: 'The AI picks nailed my taste. Fastest pizza delivery I have used.', rating: 5 },
  { name: 'Priya M.', text: 'Live tracking is so satisfying. Watched it go from oven to my door!', rating: 5 },
  { name: 'Rohan K.', text: 'Clean app, great deals, and the crust is unreal. Highly recommend.', rating: 4 },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const [pizzaPage, cats] = await Promise.all([
          pizzaService.getPizzas({ size: 12, sort: 'rating,desc' }),
          categoryService.getCategories(),
        ]);
        if (!active) return;
        setPizzas(pizzaPage.content || []);
        setCategories(cats || []);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleAdd = async (pizza) => {
    if (!isAuthenticated) {
      toast('Sign in to start ordering');
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

  const featured = pizzas.slice(0, 4);
  const trending = pizzas.slice(4, 8);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-black">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="text-white">
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur"
            >
              <Sparkles className="h-4 w-4 text-amber-300" /> AI-powered recommendations
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
            >
              Hot, Fresh Pizza —<br /><span className="text-amber-300">Powered by AI</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-md text-lg text-white/90"
            >
              Personalized picks, real-time tracking, and lightning-fast delivery to your door.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/menu" className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-orange-600 shadow-lg shadow-black/20 transition hover:shadow-xl">
                Order Now <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <a href="#featured" className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                Explore Menu
              </a>
            </motion.div>

            <div className="mt-10 flex gap-6 text-sm text-white/90">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> 30-min delivery</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Secure payments</span>
            </div>
          </div>

          {/* floating cards */}
          <div className="relative hidden h-80 md:block">
            <motion.div
              animate={{ y: [0, -16, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-8 top-6 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Pizza className="h-7 w-7" /></span>
              <div><p className="text-sm font-bold text-gray-900">Margherita</p><p className="text-xs text-gray-500">⭐ 4.8 · 20 min</p></div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 18, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 right-4 flex items-center gap-3 rounded-2xl bg-black/80 p-4 text-white shadow-2xl backdrop-blur"
            >
              <Sparkles className="h-7 w-7 text-orange-400" />
              <div><p className="text-sm font-bold">AI pick for you</p><p className="text-xs text-white/70">92% match</p></div>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-24 top-2 rounded-2xl bg-amber-400 px-4 py-2 font-extrabold text-black shadow-2xl"
            >
              50% OFF
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== AI BANNER ===== */}
      <section className="mx-auto max-w-6xl px-4">
        <Reveal className="-mt-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-6 shadow-sm sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-orange-500 p-3 text-white shadow"><Sparkles className="h-6 w-6" /></span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recommendations made for you</h2>
                <p className="text-sm text-gray-600">Scored on your taste, trends, and order history.</p>
              </div>
            </div>
            <Link to="/recommendations" className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 font-semibold text-white transition hover:bg-gray-900">
              See AI Picks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal><h2 className="mb-5 text-2xl font-extrabold">Browse by category</h2></Reveal>
        {loading ? (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link key={c.id} to={`/menu?category=${c.id}`}
                className="rounded-full border-2 border-orange-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-600 hover:shadow-md">
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== FEATURED ===== */}
      <section id="featured" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-4">
        <Reveal>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">Featured pizzas</h2>
            <Link to="/menu" className="text-sm font-semibold text-orange-600 hover:underline">View all</Link>
          </div>
        </Reveal>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <PizzaCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <EmptyState icon={UtensilsCrossed} title="Couldn't load the menu" message="Make sure the backend is running on port 8080, then refresh." />
        ) : featured.length === 0 ? (
          <EmptyState icon={Pizza} title="No pizzas yet" message="An admin can add pizzas from the Admin dashboard." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <FoodCard pizza={p} onAdd={handleAdd} to={`/menu/${p.id}`} badge={i === 0 ? 'Top rated' : undefined} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ===== TRENDING ===== */}
      {!loading && trending.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <Reveal>
            <div className="mb-6 flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-extrabold">Trending now</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <FoodCard pizza={p} onAdd={handleAdd} to={`/menu/${p.id}`} badge="Trending" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===== OFFERS ===== */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Reveal><h2 className="mb-6 text-2xl font-extrabold">Today's offers</h2></Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {OFFERS.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <div className={`flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br ${o.from} ${o.to} p-6 text-white shadow-lg`}>
                <span className="rounded-2xl bg-white/20 p-3 backdrop-blur"><o.icon className="h-7 w-7" /></span>
                <div>
                  <p className="text-2xl font-extrabold">{o.title}</p>
                  <p className="text-sm text-white/90">{o.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal><h2 className="mb-6 text-2xl font-extrabold">What our customers say</h2></Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <Quote className="h-7 w-7 text-orange-300" />
                <p className="mt-3 text-sm text-gray-700">{t.text}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-gray-900">{t.name}</span>
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'fill-amber-500 stroke-amber-500' : 'stroke-gray-300'}`} />
                    ))}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
