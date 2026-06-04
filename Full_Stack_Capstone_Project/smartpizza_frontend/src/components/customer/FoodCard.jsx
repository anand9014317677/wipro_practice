import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pizza, Plus, Sparkles, Star } from 'lucide-react';

/**
 * Premium food card.
 *  - pizza: { id, name, description, price, rating, veg, imageUrl, available, categoryName }
 *  - onAdd(pizza): renders an Add button
 *  - to: makes image + title link to details
 *  - badge: optional AI label string (shows a sparkle pill)
 */
export default function FoodCard({ pizza, onAdd, to, badge }) {
  const media = pizza.imageUrl ? (
    <img
      src={pizza.imageUrl}
      alt={pizza.name}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-orange-200">
      <Pizza className="h-12 w-12" />
    </div>
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {to ? <Link to={to} className="block h-full w-full">{media}</Link> : media}

        {/* veg / non-veg */}
        <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-md border-2 border-white bg-white/90 shadow">
          <span className={`h-2.5 w-2.5 rounded-full ${pizza.veg ? 'bg-green-600' : 'bg-red-600'}`} />
        </span>

        {/* AI label */}
        {badge && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <Sparkles className="h-3 w-3 text-orange-400" /> {badge}
          </span>
        )}

        {/* rating chip */}
        {pizza.rating > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-amber-600 shadow">
            <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" /> {pizza.rating}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {to ? (
          <Link to={to} className="font-bold leading-tight text-gray-900 hover:text-orange-600">{pizza.name}</Link>
        ) : (
          <h3 className="font-bold leading-tight text-gray-900">{pizza.name}</h3>
        )}
        {pizza.categoryName && <p className="mt-0.5 text-xs font-medium text-orange-500">{pizza.categoryName}</p>}
        {pizza.description && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{pizza.description}</p>}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-extrabold text-gray-900">₹{Number(pizza.price).toFixed(2)}</span>
          {onAdd && (
            <button
              onClick={() => onAdd(pizza)}
              disabled={pizza.available === false}
              className="inline-flex items-center gap-1 rounded-xl bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
