import { Inbox } from 'lucide-react';

/** Friendly placeholder when a list has no items. */
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message }) {
  return (
    <div className="py-12 text-center text-gray-500">
      <Icon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
      <p className="font-medium text-gray-700">{title}</p>
      {message && <p className="mt-1 text-sm">{message}</p>}
    </div>
  );
}
