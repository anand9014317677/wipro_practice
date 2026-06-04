import { Link } from 'react-router-dom';
import { Pizza, Plus, Star } from 'lucide-react';

/**
 * Reusable pizza card.
 *  - `onAdd(pizza)`  -> shows an Add button
 *  - `to`            -> makes the image + title link to the details page
 */
export default function PizzaCard({ pizza, onAdd, to }) {
  const media = pizza.imageUrl ? (
    <img src={pizza.imageUrl} alt={pizza.name} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-gray-300">
      <Pizza className="h-10 w-10" />
    </div>
  );

  return (
    <div className="card flex flex-col overflow-hidden">
      {to ? (
        <Link to={to} className="block aspect-[4/3] bg-gray-100">{media}</Link>
      ) : (
        <div className="aspect-[4/3] bg-gray-100">{media}</div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
              pizza.veg ? 'border-green-600' : 'border-red-600'
            }`}
            title={pizza.veg ? 'Veg' : 'Non-veg'}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${pizza.veg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
          {to ? (
            <Link to={to} className="font-semibold leading-tight hover:text-primary-600">
              {pizza.name}
            </Link>
          ) : (
            <h3 className="font-semibold leading-tight">{pizza.name}</h3>
          )}
        </div>

        {pizza.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{pizza.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold">₹{Number(pizza.price).toFixed(2)}</span>
            {pizza.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
                {pizza.rating}
              </span>
            )}
          </div>
          {onAdd && (
            <button
              className="btn-primary px-3 py-1.5 text-sm disabled:opacity-50"
              onClick={() => onAdd(pizza)}
              disabled={pizza.available === false}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
