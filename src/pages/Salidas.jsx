import { useState, useMemo } from 'react';
import { Plus, Pencil, Search, Filter, Bus, CalendarDays, Users, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import Modal from '../components/Modal';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import salidaService from '../services/salidaService';
import packageService from '../services/packageService';

function getAvailabilityInfo(cuposTotales, cuposOcupados) {
  const libres = cuposTotales - cuposOcupados;
  const pct = cuposTotales > 0 ? (cuposOcupados / cuposTotales) * 100 : 100;
  if (libres <= 0)                  return { label: 'Lleno',       color: 'text-red-600',    bg: 'bg-red-500',     pill: 'bg-red-100 text-red-700',     icon: XCircle };
  if (libres / cuposTotales <= 0.2) return { label: 'Pocos cupos', color: 'text-amber-600',  bg: 'bg-amber-400',   pill: 'bg-amber-100 text-amber-700',  icon: AlertTriangle };
  return                                    { label: 'Disponible',  color: 'text-emerald-600',bg: 'bg-emerald-500', pill: 'bg-emerald-100 text-emerald-700',icon: CheckCircle2 };
}

const estadoConfig = {
  programada: { label: 'Programada', cls: 'bg-sky-100 text-sky-700' },
  activa:     { label: 'Activa',     cls: 'bg-emerald-100 text-emerald-700' },
  cancelada:  { label: 'Cancelada',  cls: 'bg-red-100 text-red-600' },
  completada: { label: 'Completada', cls: 'bg-slate-100 text-slate-500' },
};

const emptyForm = { paqueteId: '', fecha: '', hora: '', cuposTotales: 20, estado: 'programada' };

export default function Salidas() {
  const { data: salidasRaw, loading, error, refetch } = useApi(() => salidaService.getAll(), []);
  const { data: pkgsRaw } = useApi(() => packageService.getAll(), []);

  const salidas = salidasRaw ?? [];
  const packages = pkgsRaw ?? [];
  const pkgMap = useMemo(() => Object.fromEntries(packages.map(p => [p.id, p])), [packages]);

  const [search, setSearch] = useState('');
  const [pkgFilter, setPkgFilter] = useState('');
  const [fechaFilter, setFechaFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => salidas.filter(s => {
    const pkg = pkgMap[s.paqueteId];
    const matchPkg   = !pkgFilter || String(s.paqueteId) === pkgFilter;
    const matchFecha = !fechaFilter || s.fecha === fechaFilter;
    const matchSearch = !search || (pkg?.destino ?? '').toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    return matchPkg && matchFecha && matchSearch;
  }), [salidas, pkgFilter, fechaFilter, search, pkgMap]);

  const stats = useMemo(() => ({
    total: salidas.length,
    activas: salidas.filter(s => s.estado === 'activa').length,
    llenas: salidas.filter(s => s.cuposOcupados >= s.cuposTotales).length,
    programadas: salidas.filter(s => s.estado === 'programada').length,
  }), [salidas]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };
  const openEdit = (s) => {
    setForm({ paqueteId: String(s.paqueteId), fecha: s.fecha, hora: s.hora, cuposTotales: s.cuposTotales, estado: s.estado });
    setEditId(s.id);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.paqueteId || !form.fecha || !form.hora) return;
    const data = { paqueteId: Number(form.paqueteId), fecha: form.fecha, hora: form.hora, cuposTotales: Number(form.cuposTotales), estado: form.estado };
    setSaving(true);
    try {
      editId ? await salidaService.update(editId, data) : await salidaService.create(data);
      setModalOpen(false);
      refetch();
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total salidas', value: stats.total,       icon: Bus,          color: 'text-slate-600',   bg: 'bg-slate-100' },
          { label: 'Activas',       value: stats.activas,     icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Programadas',   value: stats.programadas, icon: Clock,        color: 'text-sky-600',     bg: 'bg-sky-50' },
          { label: 'Llenas',        value: stats.llenas,      icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon size={18} className={color} /></div>
            <div><p className="text-2xl font-bold text-slate-800">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-64">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
              placeholder="Buscar salida..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={15} className="text-slate-400 shrink-0" />
            <select className="bg-transparent text-sm text-slate-700 outline-none" value={pkgFilter} onChange={e => setPkgFilter(e.target.value)}>
              <option value="">Todos los paquetes</option>
              {packages.map(p => <option key={p.id} value={p.id}>{p.imagen} {p.destino}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <CalendarDays size={15} className="text-slate-400 shrink-0" />
            <input type="date" className="bg-transparent text-sm text-slate-700 outline-none" value={fechaFilter} onChange={e => setFechaFilter(e.target.value)} />
            {fechaFilter && <button onClick={() => setFechaFilter('')} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>}
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus size={16} /> Nueva Salida</button>
      </div>

      {error ? <ApiError message={error} onRetry={refetch} /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="table-header">Código</th><th className="table-header">Paquete</th>
                  <th className="table-header">Fecha & Hora</th><th className="table-header">Cupos</th>
                  <th className="table-header">Disponibilidad</th><th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={7} rows={6} /> : (
                  <>
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">No se encontraron salidas con los filtros aplicados.</td></tr>
                    )}
                    {filtered.map(s => {
                      const pkg = pkgMap[s.paqueteId];
                      const avail = getAvailabilityInfo(s.cuposTotales, s.cuposOcupados);
                      const AvailIcon = avail.icon;
                      const libres = s.cuposTotales - s.cuposOcupados;
                      const pct = s.cuposTotales > 0 ? Math.min(100, (s.cuposOcupados / s.cuposTotales) * 100) : 100;
                      const estConf = estadoConfig[s.estado] ?? estadoConfig.programada;
                      return (
                        <tr key={s.id} className="table-row">
                          <td className="table-cell font-mono text-xs text-slate-500">{s.id}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{pkg?.imagen ?? '📦'}</span>
                              <div><p className="font-semibold text-slate-800 text-sm">{pkg?.destino ?? '—'}</p><p className="text-xs text-slate-400">{pkg?.categoria ?? ''}</p></div>
                            </div>
                          </td>
                          <td className="table-cell"><p className="font-medium text-slate-700 text-sm">{s.fecha}</p><p className="text-xs text-slate-400">{s.hora}</p></td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2 min-w-[110px]">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${avail.bg}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-600 whitespace-nowrap font-medium">{s.cuposOcupados}/{s.cuposTotales}</span>
                            </div>
                            <p className={`text-xs mt-0.5 ${avail.color}`}>{libres} libre{libres !== 1 ? 's' : ''}</p>
                          </td>
                          <td className="table-cell">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${avail.pill}`}>
                              <AvailIcon size={11} />{avail.label}
                            </span>
                          </td>
                          <td className="table-cell">
                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${estConf.cls}`}>{estConf.label}</span>
                          </td>
                          <td className="table-cell">
                            <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"><Pencil size={14} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400">
            {filtered.length} salida{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Disponible (+20% cupos libres)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Pocos cupos (≤20% libres)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Lleno (0 cupos disponibles)</span>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Salida' : 'Nueva Salida'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="label">Paquete turístico *</label>
            <select className="input" value={form.paqueteId} onChange={e => setForm(f => ({ ...f, paqueteId: e.target.value }))}>
              <option value="">— Seleccionar paquete —</option>
              {packages.filter(p => p.estado === 'activo').map(p => (
                <option key={p.id} value={p.id}>{p.imagen} {p.destino} — S/ {p.precio} · {p.duracion} día{p.duracion !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          {form.paqueteId && (() => {
            const pkg = pkgMap[Number(form.paqueteId)];
            return pkg ? (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-center gap-3">
                <span className="text-3xl">{pkg.imagen}</span>
                <div><p className="font-semibold text-slate-800">{pkg.destino}</p><p className="text-xs text-slate-500">{pkg.categoria} · S/ {pkg.precio}</p></div>
              </div>
            ) : null;
          })()}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Fecha de salida *</label><input type="date" className="input" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} /></div>
            <div><label className="label">Hora de salida *</label><input type="time" className="input" value={form.hora} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} /></div>
          </div>
          <div><label className="label">Cupos totales</label><input type="number" className="input" min={1} max={200} value={form.cuposTotales} onChange={e => setForm(f => ({ ...f, cuposTotales: e.target.value }))} /></div>
          <div>
            <label className="label">Estado de la salida</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(estadoConfig).map(([val, conf]) => (
                <button key={val} type="button" onClick={() => setForm(f => ({ ...f, estado: val }))}
                  className={`py-2 rounded-xl text-sm font-medium border transition-all text-center ${form.estado === val ? `${conf.cls} border-current` : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                  {conf.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Guardando…' : editId ? 'Guardar cambios' : 'Crear salida'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
