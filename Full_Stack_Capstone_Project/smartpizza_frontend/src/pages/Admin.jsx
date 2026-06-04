import { useState } from 'react';
import CategoryManager from '../components/admin/CategoryManager';
import PizzaManager from '../components/admin/PizzaManager';

const TABS = [
  { key: 'pizzas', label: 'Pizzas' },
  { key: 'categories', label: 'Categories' },
];

export default function Admin() {
  const [tab, setTab] = useState('pizzas');
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Admin dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">Manage your menu — create, edit and remove pizzas and categories.</p>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.key ? 'bg-primary-600 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pizzas' ? <PizzaManager /> : <CategoryManager />}
    </div>
  );
}
