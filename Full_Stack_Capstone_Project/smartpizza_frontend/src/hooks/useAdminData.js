import { useCallback, useEffect, useMemo, useState } from 'react';
import { deliveryService } from '../services/deliveryService';
import { pizzaService } from '../services/pizzaService';
import { categoryService } from '../services/categoryService';
import { recommendationService } from '../services/recommendationService';

const ACTIVE = ['ASSIGNED', 'ACCEPTED', 'PREPARING', 'BAKED', 'OUT_FOR_DELIVERY'];
const DELIVERY_STATUSES = ['ASSIGNED', 'ACCEPTED', 'PREPARING', 'BAKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED'];

const dayKey = (d) => d.toISOString().slice(0, 10);
const dayLabel = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/**
 * Fetches every admin-wide source the backend exposes today and derives metrics.
 * NOTE: scoped to orders that have a delivery record (the only admin-wide order
 * data available). True totals incl. unassigned orders need a Module-4 endpoint.
 */
export default function useAdminData() {
  const [deliveries, setDeliveries] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [dels, pizzaPage, cats, trend] = await Promise.all([
        deliveryService.getDeliveries(),
        pizzaService.getPizzas({ size: 100 }),
        categoryService.getCategories(),
        recommendationService.getTrending(8).catch(() => []),
      ]);
      setDeliveries(dels || []);
      setPizzas(pizzaPage?.content || []);
      setCategories(cats || []);
      setTrending(trend || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const derived = useMemo(() => {
    const revenue = deliveries
      .filter((d) => d.status === 'DELIVERED')
      .reduce((sum, d) => sum + Number(d.totalAmount || 0), 0);

    const metrics = {
      ordersTracked: deliveries.length,
      activeDeliveries: deliveries.filter((d) => ACTIVE.includes(d.status)).length,
      pending: deliveries.filter((d) => d.status === 'ASSIGNED').length,
      delivered: deliveries.filter((d) => d.status === 'DELIVERED').length,
      revenue,
      customers: new Set(deliveries.map((d) => d.customerName).filter(Boolean)).size,
    };

    const statusDistribution = DELIVERY_STATUSES
      .map((s) => ({ name: s.replace(/_/g, ' '), value: deliveries.filter((d) => d.status === s).length }))
      .filter((x) => x.value > 0);

    // last 7 days buckets
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ key: dayKey(d), label: dayLabel(d) });
    }
    const ordersPerDay = days.map(({ key, label }) => ({
      day: label,
      orders: deliveries.filter((d) => d.createdAt && dayKey(new Date(d.createdAt)) === key).length,
    }));
    const revenuePerDay = days.map(({ key, label }) => ({
      day: label,
      revenue: deliveries
        .filter((d) => d.status === 'DELIVERED' && (d.deliveredAt || d.createdAt) && dayKey(new Date(d.deliveredAt || d.createdAt)) === key)
        .reduce((s, d) => s + Number(d.totalAmount || 0), 0),
    }));

    const busiestHours = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
      orders: deliveries.filter((d) => d.createdAt && new Date(d.createdAt).getHours() === h).length,
    }));

    const vegCount = pizzas.filter((p) => p.veg).length;
    const menuMix = [
      { name: 'Veg', value: vegCount },
      { name: 'Non-veg', value: pizzas.length - vegCount },
    ].filter((x) => x.value > 0);

    const byCat = {};
    pizzas.forEach((p) => { const k = p.categoryName || 'Uncategorized'; byCat[k] = (byCat[k] || 0) + 1; });
    const menuByCategory = Object.entries(byCat).map(([name, value]) => ({ name, value }));

    const popular = (trending || []).slice(0, 6).map((t) => ({ name: t.pizzaName, score: Math.round(Number(t.score) || 0) }));

    // customers derived from delivery records
    const cmap = {};
    deliveries.forEach((d) => {
      const name = d.customerName || 'Unknown';
      if (!cmap[name]) cmap[name] = { name, orders: 0, spent: 0, last: null };
      cmap[name].orders += 1;
      cmap[name].spent += Number(d.totalAmount || 0);
      const t = d.createdAt ? new Date(d.createdAt) : null;
      if (t && (!cmap[name].last || t > cmap[name].last)) cmap[name].last = t;
    });
    const customers = Object.values(cmap).sort((a, b) => b.spent - a.spent);

    return { metrics, statusDistribution, ordersPerDay, revenuePerDay, busiestHours, menuMix, menuByCategory, popular, customers };
  }, [deliveries, pizzas, trending]);

  return { loading, error, refresh: load, deliveries, pizzas, categories, trending, ...derived };
}
