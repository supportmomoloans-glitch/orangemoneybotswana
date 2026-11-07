import { useState, useEffect, ReactNode } from 'react';
import Logo from './Logo';
import { Loader2 } from 'lucide-react';

export default function PageLoader({ duration = 500, children }: { duration?: number; children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (loading) {
    return (
      <div id="page-loader" className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 text-black p-4 font-sans">
        <Logo size="lg" />
        <h2 className="text-2xl font-black tracking-tight">
          <span className="text-[#ff7900]">Orange</span> <span className="text-black">Loans</span>
        </h2>
        <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <Loader2 className="w-5 h-5 text-[#ff7900] animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
