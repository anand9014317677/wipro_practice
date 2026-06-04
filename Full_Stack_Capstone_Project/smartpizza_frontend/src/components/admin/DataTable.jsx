/**
 * Reusable table.
 *  columns: [{ key, header, render?(row), className? }]
 *  rows, rowKey(row), loading, emptyText
 */
export default function DataTable({ columns, rows = [], rowKey = (r) => r.id, loading, emptyText = 'Nothing to show' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`whitespace-nowrap px-4 py-3 font-semibold ${c.className || ''}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3"><div className="h-4 w-24 animate-pulse rounded bg-slate-100" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">{emptyText}</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="transition hover:bg-orange-50/40">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 ${c.className || ''}`}>{c.render ? c.render(row) : row[c.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
