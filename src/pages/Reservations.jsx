import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Users, DollarSign } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import reservationService from '../services/reservationService';
import clientService from '../services/clientService';
import packageService from '../services/packageService';

const emptyForm = { clienteId: '', paqueteId: '', fecha: '', fechaViaje: '', personas: 1, estado: 'pendiente' };

const statusConfig = {
  confirmado: { label: 'Confirmado', variant: 'success' },
  pendiente:  { label: 'Pendiente',  variant: 'warning' },
  cancelado:  { label: 'Cancelado',  variant: 'danger'  },
};

export default function Reservations() {
  const { data: reservationsRaw, loading, error, refetch } = useApi(() => reservationService.getAll(), []);
  const { data: clientsRaw }  = useApi(() => clientService.getAll(), []);
  const { data: packagesRaw } = useApi(() => packageService.getAll(), []);

  const reservations = reservationsRaw ?? [];
  const clients  = clientsRaw  ?? [];
  const packages = packagesRaw ?? [];

  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [form, setForm]       = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving]   = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const filtered = reservations.filter(r => {
    const cliente = clients.find(c => c.id === (r.clienteId ?? r.cliente?.id));
    const paquete = packages.find(p => p.id === (r.paqueteId ?? r.paquete?.id));
    const matchSearch = !search ||
      String(r.id).toLowerCase().includes(search.toLowerCase()) ||
      (cliente?.nombre ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (paquete?.destino ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || r.estado === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    todos:      reservations.length,
    confirmado: reservations.filter(r => r.estado === 'confirmado').length,
    pendiente:  reservations.filter(r => r.estado === 'pendiente').length,
    cancelado:  reservations.filter(r => r.estado === 'cancelado').length,
  };

  const openCreate = () => { setForm({ ...emptyForm, fecha: today }); setEditId(null); setModalOpen(true); };
  const openEdit   = (r) => { setForm({ ...r, clienteId: r.clienteId ?? r.cliente?.id, paqueteId: r.paqueteId ?? r.paquete?.id }); setEditId(r.id); setModalOpen(true); };

  const calcTotal = () => {
    const pkg = packages.find(p => p.id === Number(form.paqueteId));
    return (pkg?.precio ?? 0) * (Number(form.personas) || 1);
  };

  const handleSave = async () => {
    const total = calcTotal();
    const data  = { ...form, clienteId: Number(form.clienteId), paqueteId: Number(form.paqueteId), personas: Number(form.personas), total };
    setSaving(true);
    try {
      editId ? await reservationService.update(editId, data) : await reservationService.create(data);
      setModalOpen(false);
      refetch();
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await reservationService.remove(deleteId);
      setDeleteId(null);
      refetch();
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-72">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
            placeholder="Buscar por ID, cliente o destino..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus size={16} /> Nueva Reserva</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'todos',      label: 'Todos' },
          { key: 'confirmado', label: 'Confirmados' },
          { key: 'pendiente',  label: 'Pendientes' },
          { key: 'cancelado',  label: 'Cancelados' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
              ${filter === key ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-400/20' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
            {label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${filter === key ? 'bg-white/20' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {error ? <ApiError message={error} onRetry={refetch} /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">ID Reserva</th><th className="table-header">Cliente</th>
                  <th className="table-header">Paquete</th><th className="table-header">Fecha Reserva</th>
                  <th className="table-header">Fecha Viaje</th><th className="table-header">Personas</th>
                  <th className="table-header">Total</th><th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={9} rows={6} /> : (
                  <>
                    {filtered.map(r => {
                      const cliente = clients.find(c => c.id === (r.clienteId ?? r.cliente?.id));
                      const paquete = packages.find(p => p.id === (r.paqueteId ?? r.paquete?.id));
                      const st = statusConfig[r.estado];
                      return (
                        <tr key={r.id} className="table-row">
                          <td className="table-cell font-mono text-brand-400 font-medium text-xs">{r.id}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{(cliente?.nombre ?? '?').charAt(0)}</div>
                              <span className="font-medium text-slate-800 whitespace-nowrap">{cliente?.nombre ?? '—'}</span>
                            </div>
                          </td>
                          <td className="table-cell"><span className="flex items-center gap-2 whitespace-nowrap"><span>{paquete?.imagen}</span>{paquete?.destino ?? '—'}</span></td>
                          <td className="table-cell text-slate-400 whitespace-nowrap">{r.fecha}</td>
                          <td className="table-cell text-slate-400 whitespace-nowrap">{r.fechaViaje}</td>
                          <td className="table-cell"><span className="flex items-center gap-1"><Users size={13} className="text-slate-500" />{r.personas}</span></td>
                          <td className="table-cell font-semibold text-slate-900 whitespace-nowrap">S/ {(r.total ?? 0).toLocaleString()}</td>
                          <td className="table-cell"><Badge label={st?.label} variant={st?.variant} /></td>
                          <td className="table-cell">
                            <div className="flex gap-1">
                              <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"><Pencil size={14} /></button>
                              <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={9} className="py-12 text-center text-slate-500">No hay reservas con los filtros seleccionados</td></tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Reserva' : 'Nueva Reserva'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Cliente</label>
              <select className="input" value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
                <option value="">— Seleccionar —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Paquete Turístico</label>
              <select className="input" value={form.paqueteId} onChange={e => setForm(f => ({ ...f, paqueteId: e.target.value }))}>
                <option value="">— Seleccionar —</option>
                {packages.filter(p => p.estado === 'activo').map(p => <option key={p.id} value={p.id}>{p.imagen} {p.destino} – S/ {p.precio}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label">Fecha de Reserva</label><input type="date" className="input" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} /></div>
            <div><label className="label">Fecha de Viaje</label><input type="date" className="input" value={form.fechaViaje} onChange={e => setForm(f => ({ ...f, fechaViaje: e.target.value }))} /></div>
            <div><label className="label">N° Personas</label><input type="number" min="1" className="input" value={form.personas} onChange={e => setForm(f => ({ ...f, personas: e.target.value }))} /></div>
          </div>
          <div>
            <label className="label">Estado</label>
            <select className="input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-200">
            <DollarSign size={18} className="text-emerald-600" />
            <div><p className="text-xs text-slate-500">Total estimado</p><p className="text-xl font-bold text-slate-900">S/ {calcTotal().toLocaleString()}</p></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Guardando…' : editId ? 'Guardar cambios' : 'Crear reserva'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Eliminar Reserva" size="sm">
        <div className="space-y-4">
          <p className="text-slate-500 text-sm">¿Eliminar esta reserva? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleDelete} disabled={saving} className="btn-danger flex-1 justify-center">{saving ? 'Eliminando…' : 'Eliminar'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
