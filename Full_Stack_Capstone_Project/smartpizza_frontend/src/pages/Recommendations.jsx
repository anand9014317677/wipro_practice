import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { recommendationService } from '../services/recommendationService';
import { useCart } from '../context/CartContext';
import RecommendationCard from '../components/RecommendationCard';
import { PizzaCardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const TABS = [
  { key: 'foryou', label: 'For You', fn: 'getRecommendations' },
  { key: 'trending', label: 'Trending', fn: 'getTrending' },
  { key: 'history', label: 'From your history', fn: 'getHistoryBased' },
  { key: 'category', label: 'By category', fn: 'getCategoryBased' },
];

const EMPTY_MESSAGES = {
  foryou: 'Add some pizzas to the menu to see picks.',
  trending: 'Nothing trending yet — check back once orders roll in.',
  history: 'Place an order first to unlock history-based picks.',
  category: 'Order from a category to get category-based picks.',
};

export default function Recommendations() {
  const { addItem } = useCart();
  const [tab, setTab] = useState('foryou');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    const fn = TABS.find((t) => t.key === tab).fn;
    recommendationService[fn]()
      .then((res) => active && setData(res))
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [tab]);

  const handleAdd = async (rec) => {
    try {
      await addItem(rec.pizzaId, 1);
      toast.success(`${rec.pizzaName} added to cart`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not add to cart');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary-600" />
        <h1 className="text-2xl font-bold">Recommended for you</h1>
      </div>
      <p className="mb-6 text-sm text-gray-500">
        AI picks scored on your taste, order history, trends and ratings.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.key
                ? 'bg-primary-600 text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <PizzaCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <EmptyState icon={Sparkles} title="Couldn't load recommendations" />
      ) : data.length === 0 ? (
        <EmptyState icon={Sparkles} title="No recommendations yet" message={EMPTY_MESSAGES[tab]} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((rec) => (
            <RecommendationCard key={rec.pizzaId} rec={rec} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
