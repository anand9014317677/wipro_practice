import { motion } from 'framer-motion';

/** White card wrapper for a chart, with title and graceful empty/loading states. */
export default function ChartCard({ title, subtitle, loading, empty, emptyText = 'No data yet', children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4">
        <h3 className="font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      {loading ? (
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
      ) : empty ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">{emptyText}</div>
      ) : (
        children
      )}
    </motion.div>
  );
}
