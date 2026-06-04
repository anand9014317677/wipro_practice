import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function AnimatedNumber({ value, format }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, Number(value) || 0, {
      duration: 0.9, ease: 'easeOut', onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);
  return <>{format ? format(display) : Math.round(display).toLocaleString()}</>;
}

/**
 * Metric card. props:
 *  - icon, label, value, sub, format(fn), gradient (tailwind gradient classes), growth (string)
 */
export default function StatCard({ icon: Icon, label, value, sub, format, gradient = 'from-slate-700 to-slate-800', growth }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="flex items-center justify-between">
        <span className="rounded-xl bg-white/15 p-2 backdrop-blur">{Icon && <Icon className="h-5 w-5" />}</span>
        {growth && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
            <TrendingUp className="h-3 w-3" /> {growth}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight">
        <AnimatedNumber value={value} format={format} />
      </p>
      <p className="mt-1 text-sm font-medium text-white/80">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-white/60">{sub}</p>}
    </motion.div>
  );
}
