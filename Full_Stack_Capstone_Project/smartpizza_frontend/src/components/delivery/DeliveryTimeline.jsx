import { motion } from 'framer-motion';
import { Bike, CheckCircle2, Flag, Package, Truck } from 'lucide-react';
import { formatDateTime } from '../../utils/format';

const STEPS = [
  { key: 'ASSIGNED', label: 'Assigned', icon: Package },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { key: 'READY_TO_PICKUP', label: 'Pickup', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'On the way', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: Flag },
];

/** Map-style delivery progress. `times` maps step key -> ISO timestamp (optional). */
export default function DeliveryTimeline({ status, times = {} }) {
  const idx = Math.max(0, STEPS.findIndex((s) => s.key === status));
  const pct = (idx / (STEPS.length - 1)) * 100;

  return (
    <div className="rounded-2xl bg-teal-50/70 p-4">
      {/* map-style route */}
      <div className="relative mx-1 mb-6 mt-2 h-1.5 rounded-full bg-teal-200">
        <motion.div
          className="absolute left-0 top-0 h-1.5 rounded-full bg-teal-500"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute -top-3 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg"
          initial={{ left: 0 }} animate={{ left: `${pct}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Bike className="h-4 w-4" />
        </motion.div>
      </div>

      <div className="flex justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const state = i < idx ? 'done' : i === idx ? 'active' : 'todo';
          return (
            <div key={s.key} className="flex w-16 flex-col items-center text-center">
              <motion.div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  state === 'active' ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                  : state === 'done' ? 'bg-teal-600 text-white' : 'bg-white text-gray-300'
                }`}
                animate={state === 'active' ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={state === 'active' ? { duration: 1.4, repeat: Infinity } : {}}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <p className={`mt-1.5 text-[11px] font-semibold ${state === 'todo' ? 'text-gray-400' : 'text-gray-800'}`}>{s.label}</p>
              {times[s.key] && <p className="text-[9px] leading-tight text-gray-400">{formatDateTime(times[s.key])}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
