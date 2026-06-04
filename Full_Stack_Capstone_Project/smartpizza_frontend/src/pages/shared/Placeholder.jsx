import { Hammer } from 'lucide-react';

/** Clearly-labelled stand-in for sections that are built in a later module. */
export default function Placeholder({ title = 'Coming soon', note }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <div className="rounded-full bg-amber-100 p-4">
        <Hammer className="h-8 w-8 text-amber-600" />
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="max-w-md text-sm text-gray-500">
        {note || 'This section is part of an upcoming build step. The navigation and routing are wired and ready for it.'}
      </p>
    </div>
  );
}
