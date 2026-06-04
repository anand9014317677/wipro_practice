import { useEffect, useState } from 'react';
import { Pencil, Pizza, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { pizzaService } from '../../services/pizzaService';
import { categoryService } from '../../services/categoryService';
import { formatMoney } from '../../utils/format';
import EmptyState from '../EmptyState';

const SIZES = ['SMALL', 'MEDIUM', 'LARGE'];
const BLANK = {
  name: '', description: '', price: '', size: 'MEDIUM',
  veg: true, imageUrl: '', categoryId: '', available: true,
};

export default function PizzaManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([pizzaService.getPizzas({ size: 100 }), categoryService.getCategories()])
      .then(([page, cats]) => {
        setItems(page.content || []);
        setCategories(cats || []);
      })
      .catch(() => toast.error('Could not load pizzas'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setForm({ ...BLANK });
  const openEdit = (p) =>
    setForm({
      id: p.id,
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      size: p.size || 'MEDIUM',
      veg: !!p.veg,
      imageUrl: p.imageUrl || '',
      categoryId: p.categoryId ?? '',
      available: p.available !== false,
    });

  const save = async () => {
    if (!form.name || form.name.trim().length < 2) return toast.error('Name must be at least 2 characters');
    if (!form.price || Number(form.price) <= 0) return toast.error('Price must be greater than 0');
    if (!form.categoryId) return toast.error('Please choose a category');

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      price: Number(form.price),
      size: form.size,
      veg: form.veg,
      imageUrl: form.imageUrl?.trim() || undefined,
      categoryId: Number(form.categoryId),
      available: form.available,
    };
    try {
      if (form.id) await pizzaService.updatePizza(form.id, payload);
      else await pizzaService.createPizza(payload);
      toast.success(form.id ? 'Pizza updated' : 'Pizza created');
      setForm(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await pizzaService.deletePizza(p.id);
      toast.success('Pizza deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="btn-primary" onClick={openNew}>
          <Plus className="h-4 w-4" /> New pizza
        </button>
      </div>

      {form && (
        <div className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{form.id ? 'Edit pizza' : 'New pizza'}</h3>
            <button onClick={() => setForm(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Name *" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <input className="input" type="number" step="0.01" min="0" placeholder="Price *" value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <input className="input sm:col-span-2" placeholder="Description" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <input className="input sm:col-span-2" placeholder="Image URL" value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
            <select className="input" value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Select category *</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="input" value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="input" value={form.veg ? 'veg' : 'nonveg'}
              onChange={(e) => setForm((f) => ({ ...f, veg: e.target.value === 'veg' }))}>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-veg</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-primary-600" checked={form.available}
                onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} />
              Available
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn-outline" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Pizza} title="No pizzas yet" message="Add your first pizza to the menu." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Pizza</th>
                <th className="hidden p-3 md:table-cell">Category</th>
                <th className="hidden p-3 sm:table-cell">Size</th>
                <th className="p-3">Price</th>
                <th className="hidden p-3 sm:table-cell">Veg</th>
                <th className="p-3">Available</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="hidden p-3 text-gray-500 md:table-cell">{p.categoryName || '—'}</td>
                  <td className="hidden p-3 text-gray-500 sm:table-cell">{p.size}</td>
                  <td className="p-3">{formatMoney(p.price)}</td>
                  <td className="hidden p-3 sm:table-cell">
                    <span className={`inline-block h-3 w-3 rounded-sm ${p.veg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.available !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.available !== false ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" onClick={() => openEdit(p)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" onClick={() => remove(p)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
