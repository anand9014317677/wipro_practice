import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import EmptyState from '../EmptyState';

const BLANK = { name: '', description: '', imageUrl: '', active: true };

export default function CategoryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = closed; object = open
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    categoryService
      .getCategories()
      .then(setItems)
      .catch(() => toast.error('Could not load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setForm({ ...BLANK });
  const openEdit = (c) =>
    setForm({
      id: c.id,
      name: c.name || '',
      description: c.description || '',
      imageUrl: c.imageUrl || '',
      active: c.active !== false,
    });

  const save = async () => {
    if (!form.name || form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
      active: form.active,
    };
    try {
      if (form.id) await categoryService.updateCategory(form.id, payload);
      else await categoryService.createCategory(payload);
      toast.success(form.id ? 'Category updated' : 'Category created');
      setForm(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    try {
      await categoryService.deleteCategory(c.id);
      toast.success('Category deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button className="btn-primary" onClick={openNew}>
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>

      {form && (
        <div className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{form.id ? 'Edit category' : 'New category'}</h3>
            <button onClick={() => setForm(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className="input" placeholder="Name *" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <input className="input" placeholder="Image URL" value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
            <input className="input sm:col-span-2" placeholder="Description" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-primary-600" checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              Active
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
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-200" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No categories yet" message="Create one to start organising the menu." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="hidden p-3 sm:table-cell">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="hidden p-3 text-gray-500 sm:table-cell">{c.description || '—'}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" onClick={() => openEdit(c)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" onClick={() => remove(c)} title="Delete">
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
