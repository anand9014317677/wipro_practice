import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import useAdminData from '../../hooks/useAdminData';
import DataTable from '../../components/admin/DataTable';
import { formatDateTime, formatMoney } from '../../utils/format';

const PAGE_SIZE = 10;

export default function Customers() {
  const { loading, customers } = useAdminData();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? customers.filter((c) => c.name.toLowerCase().includes(term)) : customers;
  }, [customers, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const columns = [
    { key: 'name', header: 'Customer', render: (c) => <span className="font-semibold text-slate-800">{c.name}</span> },
    { key: 'orders', header: 'Orders', render: (c) => c.orders },
    { key: 'spent', header: 'Total spent', render: (c) => <span className="font-semibold">{formatMoney(c.spent)}</span> },
    { key: 'last', header: 'Last order', className: 'text-slate-500', render: (c) => (c.last ? formatDateTime(c.last) : '—') },
    { key: 'status', header: 'Status', render: () => <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Active</span> },
  ];

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-slate-800">Customers</h1>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search customers…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>
      <p className="mb-6 text-xs text-slate-400">Derived from delivery records (customers who have placed an order).</p>

      <DataTable columns={columns} rows={pageRows} rowKey={(c) => c.name} loading={loading} emptyText="No customers yet." />

      {filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
            disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
          <span className="text-sm text-slate-500">Page {page + 1} of {totalPages}</span>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
            disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
