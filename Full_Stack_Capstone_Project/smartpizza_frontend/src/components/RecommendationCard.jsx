import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pizza, Plus, Sparkles, Star } from 'lucide-react';

/** AI recommendation card: glowing border, animated sparkle, score + reason. */
export default function RecommendationCard({ rec, onAdd }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 p-[1.5px] shadow-sm hover:shadow-xl"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {rec.imageUrl ? (
            <Link to={`/menu/${rec.pizzaId}`}>
              <img src={rec.imageUrl} alt={rec.pizzaName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </Link>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-orange-200"><Pizza className="h-12 w-12" /></div>
          )}
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
            {Number(rec.score).toFixed(0)} match
          </span>
          <span className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-md border-2 border-white bg-white/90">
            <span className={`h-2.5 w-2.5 rounded-full ${rec.veg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <Link to={`/menu/${rec.pizzaId}`} className="font-bold leading-tight text-gray-900 hover:text-orange-600">
            {rec.pizzaName}
          </Link>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-orange-600">
            <motion.span animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <Sparkles className="h-3.5 w-3.5" />
            </motion.span>
            {rec.reason}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-gray-900">₹{Number(rec.price).toFixed(2)}</span>
              {rec.rating > 0 && (
                <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
                  <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" /> {rec.rating}
                </span>
              )}
            </div>
            {onAdd && (
              <button onClick={() => onAdd(rec)}
                className="inline-flex items-center gap-1 rounded-xl bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95">
                <Plus className="h-4 w-4" /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
