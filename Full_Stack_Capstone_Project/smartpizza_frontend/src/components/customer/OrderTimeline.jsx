import { motion } from 'framer-motion';
import { Bike, ChefHat, CheckCircle2, ClipboardList, Flame, Package, PackageCheck, Truck, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/format';

// canonical order ladder (matches backend OrderStatus). ACCEPTED/ASSIGNED join
// once the admin order-status endpoints land in a later module.
const STEPS = [
  { key: 'PLACED', label: 'Placed', icon: ClipboardList },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'BAKED', label: 'Baked', icon: Flame },
  { key: 'ASSIGNED', label: 'Assigned', icon: Package },
  { key: 'READY_TO_PICKUP', label: 'Ready', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'On the way', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

// CONFIRMED (payment) maps to the PLACED milestone — paid, awaiting kitchen.
const STATUS_INDEX = {
  PLACED: 0, CONFIRMED: 0, ACCEPTED: 1, PREPARING: 2, BAKED: 3,
  ASSIGNED: 4, READY_TO_PICKUP: 5, OUT_FOR_DELIVERY: 6, DELIVERED: 7,
};

export default function OrderTimeline({ current, history = [] }) {
  const timeMap = {};
  history.forEach((h) => { timeMap[h.status] = h.changedAt; });

  if (current === 'CANCELLED') {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
        <div className="flex items-center gap-2 font-bold text-red-600">
          <XCircle className="h-5 w-5" /> Order cancelled
        </div>
        {timeMap.CANCELLED && <p className="mt-1 text-sm text-red-500">{formatDateTime(timeMap.CANCELLED)}</p>}
      </div>
    );
  }

  const currentIndex = STATUS_INDEX[current] ?? 0;
  const pct = STEPS.length > 1 ? (currentIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-6 text-lg font-bold">Live tracking</h2>

      {/* horizontal (md+) */}
      <div className="relative hidden md:block">
        <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-gray-200" />
        <motion.div
          className="absolute left-0 top-5 h-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="relative flex justify-between">
          {STEPS.map((s, i) => (
            <Step key={s.key} step={s} state={i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo'} time={timeMap[s.key]} vertical={false} />
          ))}
        </div>
      </div>

      {/* vertical (mobile) */}
      <div className="relative md:hidden">
        <div className="absolute bottom-3 left-5 top-3 w-1 rounded-full bg-gray-200" />
        <motion.div
          className="absolute left-5 top-3 w-1 rounded-full bg-gradient-to-b from-orange-400 to-orange-600"
          initial={{ height: 0 }} animate={{ height: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="relative space-y-6">
          {STEPS.map((s, i) => (
            <Step key={s.key} step={s} state={i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'todo'} time={timeMap[s.key]} vertical />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step({ step, state, time, vertical }) {
  const Icon = step.icon;
  const ring =
    state === 'active'
      ? 'bg-orange-500 text-white ring-4 ring-orange-200'
      : state === 'done'
      ? 'bg-orange-500 text-white'
      : 'bg-gray-100 text-gray-400';

  const circle = (
    <motion.div
      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${ring}`}
      animate={state === 'active' ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={state === 'active' ? { duration: 1.4, repeat: Infinity } : {}}
    >
      <Icon className="h-5 w-5" />
    </motion.div>
  );

  if (vertical) {
    return (
      <div className="flex items-center gap-4">
        {circle}
        <div>
          <p className={`text-sm font-bold ${state === 'todo' ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</p>
          {time && <p className="text-xs text-gray-400">{formatDateTime(time)}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-16 flex-col items-center text-center">
      {circle}
      <p className={`mt-2 text-xs font-bold ${state === 'todo' ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</p>
      {time && <p className="mt-0.5 text-[10px] leading-tight text-gray-400">{formatDateTime(time)}</p>}
    </div>
  );
}
