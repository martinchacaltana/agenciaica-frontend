import { DollarSign, Users, CalendarCheck, TrendingUp, RefreshCw } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { ApiError } from '../hooks/ApiComponents';
import dashboardService from '../services/dashboardService';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name === 'ingresos' ? `S/ ${p.value.toLocaleString()}` : `${p.value} reservas`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const statusConfig = {
  confirmado: { label: 'Confirmado', variant: 'success' },
  pendiente:  { label: 'Pendiente',  variant: 'warning' },
  cancelado:  { label: 'Cancelado',  variant: 'danger'  },
};

/** Skeleton para las stat cards */
function StatCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
    </div>
  );
}

/** Skeleton para gráficos */
function ChartSkeleton({ height = 220 }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="h-full bg-slate-100 rounded-xl" />
    </div>
  );
}

export default function Dashboard() {
  const {
    data: stats, loading: loadingStats, error: errorStats, refetch: refetchStats
  } = useApi(() => dashboardService.getStats(), []);

  const {
    data: monthly, loading: loadingMonthly, error: errorMonthly, refetch: refetchMonthly
  } = useApi(() => dashboardService.getMonthlyStats(), []);

  const {
    data: destinos, loading: loadingDestinos, error: errorDestinos, refetch: refetchDestinos
  } = useApi(() => dashboardService.getDestinoStats(), []);

  const {
    data: recientes, loading: loadingRecientes, error: errorRecientes, refetch: refetchRecientes
  } = useApi(() => dashboardService.getRecentReservations(), []);

  const hasError = errorStats || errorMonthly || errorDestinos || errorRecientes;
  const refetchAll = () => { refetchStats(); refetchMonthly(); refetchDestinos(); refetchRecientes(); };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : errorStats ? (
          <div className="col-span-4">
            <ApiError message={errorStats} onRetry={refetchStats} />
          </div>
        ) : (
          <>
            <StatCard label="Ingresos Totales"  value={`S/ ${(stats?.totalIngresos ?? 0).toLocaleString()}`} icon={DollarSign}    trend={12.5}  trendLabel="vs mes anterior" color="emerald" />
            <StatCard label="Total Reservas"    value={stats?.totalReservas ?? 0}                             icon={CalendarCheck} trend={8.3}   trendLabel="vs mes anterior" color="brand"   />
            <StatCard label="Clientes Activos"  value={stats?.clientesActivos ?? 0}                           icon={Users}         trend={5.1}   trendLabel="este mes"        color="purple"  />
            <StatCard label="Paquetes Activos"  value={stats?.paquetesActivos ?? 0}                           icon={TrendingUp}    trend={2.4}   trendLabel="nuevos paquetes" color="amber"   />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Ingresos Mensuales</h3>
              <p className="text-xs text-slate-500 mt-0.5">Evolución del año</p>
            </div>
            {!loadingMonthly && !errorMonthly && monthly && (
              <span className="text-2xl font-bold text-emerald-600">
                S/ {monthly.reduce((s, m) => s + (m.ingresos ?? 0), 0).toLocaleString()}
              </span>
            )}
          </div>
          {loadingMonthly ? <ChartSkeleton /> : errorMonthly ? (
            <ApiError message={errorMonthly} onRetry={refetchMonthly} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly ?? []}>
                <defs>
                  <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `S/${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2} fill="url(#ingGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar chart */}
        <div className="card">
          <div className="mb-6">
            <h3 className="font-bold text-slate-800">Destinos Populares</h3>
            <p className="text-xs text-slate-500 mt-0.5">Por número de reservas</p>
          </div>
          {loadingDestinos ? <ChartSkeleton /> : errorDestinos ? (
            <ApiError message={errorDestinos} onRetry={refetchDestinos} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={destinos ?? []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="destino" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reservas" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Últimas Reservas */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800">Últimas Reservas</h3>
            <p className="text-xs text-slate-500 mt-0.5">Actividad reciente del sistema</p>
          </div>
          {hasError && (
            <button onClick={refetchAll} className="flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 transition-colors">
              <RefreshCw size={13} /> Reintentar todo
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header">ID</th>
                <th className="table-header">Cliente</th>
                <th className="table-header">Destino</th>
                <th className="table-header">Fecha Viaje</th>
                <th className="table-header">Total</th>
                <th className="table-header">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loadingRecientes ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: '70%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : errorRecientes ? (
                <tr>
                  <td colSpan={6}>
                    <ApiError message={errorRecientes} onRetry={refetchRecientes} />
                  </td>
                </tr>
              ) : (recientes ?? []).map(r => {
                const st = statusConfig[r.estado];
                return (
                  <tr key={r.id} className="table-row">
                    <td className="table-cell font-mono text-brand-400 font-medium">{r.id}</td>
                    <td className="table-cell font-medium text-slate-700">{r.clienteNombre ?? r.cliente?.nombre}</td>
                    <td className="table-cell">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{r.paqueteImagen ?? r.paquete?.imagen}</span>
                        {r.paqueteDestino ?? r.paquete?.destino}
                      </span>
                    </td>
                    <td className="table-cell text-slate-500">{r.fechaViaje}</td>
                    <td className="table-cell font-semibold text-slate-900">S/ {(r.total ?? 0).toLocaleString()}</td>
                    <td className="table-cell">
                      <Badge label={st?.label} variant={st?.variant} />
                    </td>
                  </tr>
                );
              })}
              {!loadingRecientes && !errorRecientes && (recientes ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">Sin reservas recientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
