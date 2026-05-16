import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, trend, trendLabel, color = 'brand' }) {
  const colorMap = {
    brand:   { bg: 'from-brand-600 to-brand-700',   ring: 'ring-brand-500/30'   },
    emerald: { bg: 'from-emerald-600 to-emerald-700', ring: 'ring-emerald-500/30' },
    amber:   { bg: 'from-amber-500 to-amber-600',    ring: 'ring-amber-500/30'   },
    purple:  { bg: 'from-purple-600 to-purple-700',  ring: 'ring-purple-500/30'  },
  };
  const c = colorMap[color] ?? colorMap.brand;
  const isPositive = trend >= 0;

  return (
    <div className="card hover:border-brand-200 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{isPositive ? '+' : ''}{trend}% {trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center ring-1 ${c.ring} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}
