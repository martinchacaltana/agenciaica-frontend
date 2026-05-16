import { useState } from 'react';
import { Plus, Search, CreditCard, Banknote, Building2, DollarSign } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import paymentService from '../services/paymentService';
import clientService from '../services/clientService';
import reservationService from '../services/reservationService';

const statusConfig = {
  pagado:      { label: 'Pagado',      variant: 'success' },
  pendiente:   { label: 'Pendiente',   variant: 'warning' },
  reembolsado: { label: 'Reembolsado', variant: 'info'    },
};

const metodosConfig = {
  tarjeta:      { label: 'Tarjeta',       icon: CreditCard,  color: 'text-brand-600' },
  transferencia:{ label: 'Transferencia', icon: Building2,   color: 'text-purple-600' },
  efectivo:     { label: 'Efectivo',      icon: Banknote,    color: 'text-emerald-600' },
};

const emptyForm = { reservaId: '', clienteId: '', monto: '', metodo: 'tarjeta', estado: 'pendiente', referencia: '' };

export default function Payments() {
  const { data: paymentsRaw,     loading, error, refetch } = useApi(() => paymentService.getAll(), []);
  const { data: clientsRaw }                               = useApi(() => clientService.getAll(), []);
  const { data: reservationsRaw }                          = useApi(() => reservationService.getAll(), []);

  const payments     = paymentsRaw     ?? [];
  const clients      = clientsRaw      ?? [];
  const reservations = reservationsRaw ?? [];

  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  const filtered = payments.filter(p => {
    const cliente = clients.find(c => c.id === (p.clienteId ?? p.cliente?.id));
    const matchSearch = !search ||
      String(p.id).toLowerCase().includes(search.toLowerCase()) ||
      String(p.reservaId ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (cliente?.nombre ?? '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || p.estado === filter;
    return matchSearch && matchFilter;
  });

  const totalPagado      = payments.filter(p => p.estado === 'pagado').reduce((s, p) => s + (p.monto ?? 0), 0);
  const totalPendiente   = payments.filter(p => p.estado === 'pendiente').reduce((s, p) => s + (p.monto ?? 0), 0);
  const totalReembolsado = payments.filter(p => p.estado === 'reembolsado').reduce((s, p) => s + (p.monto ?? 0), 0);

  const handleReservaChange = (reservaId) => {
    const res = reservations.find(r => String(r.id) === String(reservaId));
    setForm(f => ({ ...f, reservaId, clienteId: res?.clienteId ?? res?.cliente?.id ?? f.clienteId, monto: res?.total ? String(res.total) : f.monto }));
  };

  const handleSave = async () => {
    if (!form.monto) return;
    const data = { ...form, clienteId: Number(form.clienteId), monto: Number(form.monto), fecha: new Date().toISOString().split('T')[0], referencia: form.referencia || `TXN-${Date.now().toString().slice(-4)}` };
    setSaving(true);
    try {
      await paymentService.create(data);
      setModalOpen(false);
      setForm(emptyForm);
      refetch();
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  const SummaryCard = ({ label, value, colorClass, borderClass }) => (
    <div className={`card shadow-sm ${borderClass}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${colorClass.bg} flex items-center justify-center`}>
          <DollarSign size={22} className={colorClass.icon} />
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-900">S/ {value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Cobrado"     value={totalPagado}      colorClass={{ bg: 'bg-emerald-50', icon: 'text-emerald-600' }} borderClass="border-emerald-100" />
        <SummaryCard label="Pendiente"   value={totalPendiente}   colorClass={{ bg: 'bg-amber-50',   icon: 'text-amber-600'   }} borderClass="border-amber-100" />
        <SummaryCard label="Reembolsado" value={totalReembolsado} colorClass={{ bg: 'bg-brand-50',   icon: 'text-brand-600'   }} borderClass="border-brand-100" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-72">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
            placeholder="Buscar por ID, reserva o cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary shrink-0"><Plus size={16} /> Registrar Pago</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['todos','pagado','pendiente','reembolsado'].map(key => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${filter === key ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-400/20' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {error ? <ApiError message={error} onRetry={refetch} /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">ID Pago</th><th className="table-header">Reserva</th>
                  <th className="table-header">Cliente</th><th className="table-header">Monto</th>
                  <th className="table-header">Método</th><th className="table-header">Referencia</th>
                  <th className="table-header">Fecha</th><th className="table-header">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={8} rows={6} /> : (
                  <>
                    {filtered.map(p => {
                      const cliente = clients.find(c => c.id === (p.clienteId ?? p.cliente?.id));
                      const metodo = metodosConfig[p.metodo];
                      const MetodoIcon = metodo?.icon;
                      const st = statusConfig[p.estado];
                      return (
                        <tr key={p.id} className="table-row">
                          <td className="table-cell font-mono text-emerald-400 font-medium text-xs">{p.id}</td>
                          <td className="table-cell font-mono text-brand-400 text-xs">{p.reservaId}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{(cliente?.nombre ?? '?').charAt(0)}</div>
                              <span className="font-medium text-slate-800 whitespace-nowrap">{cliente?.nombre ?? '—'}</span>
                            </div>
                          </td>
                          <td className="table-cell font-bold text-slate-900">S/ {(p.monto ?? 0).toLocaleString()}</td>
                          <td className="table-cell">{metodo && <span className={`flex items-center gap-1.5 text-sm ${metodo.color}`}><MetodoIcon size={14} />{metodo.label}</span>}</td>
                          <td className="table-cell font-mono text-xs text-slate-400">{p.referencia}</td>
                          <td className="table-cell text-slate-400 whitespace-nowrap">{p.fecha}</td>
                          <td className="table-cell"><Badge label={st?.label} variant={st?.variant} /></td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} className="py-12 text-center text-slate-500">No hay pagos con los filtros seleccionados</td></tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setForm(emptyForm); }} title="Registrar Pago" size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Reserva</label>
            <select className="input" value={form.reservaId} onChange={e => handleReservaChange(e.target.value)}>
              <option value="">-- Seleccionar reserva --</option>
              {reservations.map(r => {
                const c = clients.find(cl => cl.id === (r.clienteId ?? r.cliente?.id));
                return <option key={r.id} value={r.id}>{r.id} – {c?.nombre ?? '?'} – S/ {r.total}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="label">Cliente</label>
            <select className="input" value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
              <option value="">-- Seleccionar cliente --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Monto (S/)</label><input type="number" className="input" placeholder="0.00" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} /></div>
            <div><label className="label">Referencia</label><input type="text" className="input" placeholder="TXN-XXXX" value={form.referencia} onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Método de Pago</label>
              <select className="input" value={form.metodo} onChange={e => setForm(f => ({ ...f, metodo: e.target.value }))}>
                <option value="tarjeta">💳 Tarjeta</option>
                <option value="transferencia">🏦 Transferencia</option>
                <option value="efectivo">💵 Efectivo</option>
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select className="input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="reembolsado">Reembolsado</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setModalOpen(false); setForm(emptyForm); }} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Registrando…' : 'Registrar Pago'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
