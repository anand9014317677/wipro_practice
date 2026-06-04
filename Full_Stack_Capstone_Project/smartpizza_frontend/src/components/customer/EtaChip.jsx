import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

/** Honest, heuristic ETA chip. Renders nothing when there's no remaining time. */
export default function EtaChip({ minutes, className = '' }) {
  if (!minutes || minutes <= 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className={`inline-flex flex-col rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 ${className}`}
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
        <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <Clock className="h-4 w-4" />
        </motion.span>
        Estimated delivery in {minutes} mins
      </span>
      <span className="text-[11px] text-primary-400">Predicted from current workflow</span>
    </motion.div>
  );
}
