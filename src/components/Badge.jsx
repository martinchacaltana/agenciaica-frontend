export default function Badge({ label, variant = 'default' }) {
  const styles = {
    default:    'bg-slate-100 text-slate-600 border border-slate-200',
    success:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning:    'bg-amber-50 text-amber-700 border border-amber-200',
    danger:     'bg-red-50 text-red-700 border border-red-200',
    info:       'bg-brand-50 text-brand-700 border border-brand-200',
    purple:     'bg-purple-50 text-purple-700 border border-purple-200',
    pink:       'bg-pink-50 text-pink-700 border border-pink-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant] ?? styles.default}`}>
      {label}
    </span>
  );
}
