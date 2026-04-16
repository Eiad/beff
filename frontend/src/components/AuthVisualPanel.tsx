import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const STATS = [
  { icon: TrendingUp, value: '142', label: 'tonnes CO₂ reduced', color: 'text-emerald-600' },
  { icon: Users, value: '8', label: 'Teams enrolled', color: 'text-blue-600' },
  { icon: ShieldCheck, value: '94%', label: 'Compliance score', color: 'text-amber-600' },
];

export default function AuthVisualPanel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STATS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stat = STATS[activeIndex];

  return (
    <div className="hidden lg:flex relative flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 overflow-hidden">
      {/* Organic SVG shapes */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="650" cy="150" rx="200" ry="120" fill="#d1fae5" className="animate-[drift_20s_ease-in-out_infinite]" />
        <ellipse cx="150" cy="600" rx="180" ry="100" fill="#ccfbf1" className="animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <path d="M400 200 Q500 100 600 200 Q500 300 400 200" fill="#a7f3d0" opacity="0.5" className="animate-[drift_18s_ease-in-out_infinite]" />
        <circle cx="300" cy="400" r="80" fill="#d1fae5" opacity="0.4" className="animate-[drift_22s_ease-in-out_infinite_reverse]" />
      </svg>

      {/* Leaf watermark */}
      <Leaf size={120} className="absolute top-1/4 right-1/4 text-emerald-200/40 rotate-12" />

      {/* Rotating stat card */}
      <div className="relative z-10 w-72">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg p-6 text-center"
          >
            <stat.icon size={28} className={`mx-auto mb-3 ${stat.color}`} />
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {STATS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-emerald-500' : 'w-1.5 bg-emerald-300/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-8 text-sm text-emerald-700/60 font-medium">
        Greener business, together.
      </p>
    </div>
  );
}
