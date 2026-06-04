import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Apple, Globe, Mail, Pizza, Play, Share2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Subscribed! 🍕');
    setEmail('');
  };

  return (
    <footer className="mt-16 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2 text-lg font-extrabold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                <Pizza className="h-5 w-5" />
              </span>
              SmartPizza
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Hot, fresh pizza powered by AI. Personalized picks, live tracking, and lightning-fast delivery.
            </p>
            <div className="mt-4 flex gap-3">
              {[Globe, Mail, Share2].map((Icon, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="rounded-full bg-gray-800 p-2 text-gray-300 transition hover:bg-orange-500 hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/menu" className="hover:text-orange-400">Menu</Link></li>
              <li><Link to="/recommendations" className="hover:text-orange-400">AI Picks</Link></li>
              <li><Link to="/orders" className="hover:text-orange-400">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-orange-400">Cart</Link></li>
            </ul>
          </div>

          {/* newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Get offers</h4>
            <p className="mb-3 text-sm text-gray-400">Join our newsletter for deals & new flavors.</p>
            <form onSubmit={subscribe} className="flex overflow-hidden rounded-xl bg-gray-800">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
              />
              <button type="submit" className="bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600">Join</button>
            </form>
          </div>

          {/* app download */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Get the app</h4>
            <div className="space-y-2">
              <button className="flex w-full items-center gap-3 rounded-xl border border-gray-700 px-3 py-2 text-left transition hover:border-orange-500">
                <Apple className="h-5 w-5" />
                <span className="text-xs leading-tight">Download on the<br /><span className="text-sm font-semibold text-white">App Store</span></span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl border border-gray-700 px-3 py-2 text-left transition hover:border-orange-500">
                <Play className="h-5 w-5" />
                <span className="text-xs leading-tight">Get it on<br /><span className="text-sm font-semibold text-white">Google Play</span></span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} SmartPizza AI. All rights reserved.</p>
          <p>Built as an AI capstone — demo project.</p>
        </div>
      </div>
    </footer>
  );
}
