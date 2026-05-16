import { useState } from 'react';
import { Plus, Search, FileText, Receipt, FileMinus, FilePlus, Printer } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import voucherService from '../services/voucherService';
import clientService from '../services/clientService';

const typeConfig = {
  'boleta':       { label: 'Boleta',          icon: Receipt,   variant: 'success' },
  'factura':      { label: 'Factura',          icon: FileText,  variant: 'brand'   },
  'nota_credito': { label: 'Nota de Crédito',  icon: FileMinus, variant: 'warning' },
  'nota_debito':  { label: 'Nota de Débito',   icon: FilePlus,  variant: 'danger'  },
};

const emptyForm = { tipo: 'boleta', clienteId: '', fecha: '', detalle: '', total: '' };

export default function Vouchers() {
  const { data: vouchersRaw, loading, error, refetch } = useApi(() => voucherService.getAll(), []);
  const { data: clientsRaw }                           = useApi(() => clientService.getAll(), []);

  const vouchers = vouchersRaw ?? [];
  const clients  = clientsRaw  ?? [];

  const [search, setSearch]     = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const filtered = vouchers.filter(v => {
    const cliente = clients.find(c => c.id === (v.clienteId ?? v.cliente?.id));
    const matchSearch = !search ||
      (v.numero ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (v.detalle ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (cliente?.nombre ?? '').toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'todos' || v.tipo === activeTab;
    return matchSearch && matchTab;
  });

  const counts = {
    todos: vouchers.length,
    boleta: vouchers.filter(v => v.tipo === 'boleta').length,
    factura: vouchers.filter(v => v.tipo === 'factura').length,
    nota_credito: vouchers.filter(v => v.tipo === 'nota_credito').length,
    nota_debito: vouchers.filter(v => v.tipo === 'nota_debito').length,
  };

  const openCreate = () => {
    setForm({ ...emptyForm, fecha: today, tipo: activeTab === 'todos' ? 'boleta' : activeTab });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.total || !form.detalle) return;
    const data = { ...form, clienteId: Number(form.clienteId), total: Number(form.total) };
    setSaving(true);
    try {
      await voucherService.create(data);
      setModalOpen(false);
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
            placeholder="Buscar por número, cliente o detalle..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus size={16} /> Emitir Comprobante</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setActiveTab('todos')} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${activeTab === 'todos' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
          Todos ({counts.todos})
        </button>
        {Object.entries(typeConfig).map(([key, config]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${activeTab === key ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-400/20' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
            <config.icon size={15} />{config.label}
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-white/20' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {error ? <ApiError message={error} onRetry={refetch} /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Número</th><th className="table-header">Tipo</th>
                  <th className="table-header">Cliente</th><th className="table-header">Detalle</th>
                  <th className="table-header">Fecha</th><th className="table-header text-right">Total</th>
                  <th className="table-header">Estado</th><th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={8} rows={5} /> : (
                  <>
                    {filtered.map(v => {
                      const cliente = clients.find(c => c.id === (v.clienteId ?? v.cliente?.id));
                      const conf = typeConfig[v.tipo];
                      const IconComponent = conf?.icon || FileText;
                      return (
                        <tr key={v.id} className="table-row">
                          <td className="table-cell font-mono text-slate-900 font-medium">{v.numero}</td>
                          <td className="table-cell"><span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"><IconComponent size={14} className="text-slate-400" />{conf?.label}</span></td>
                          <td className="table-cell"><div className="font-medium text-slate-800">{cliente?.nombre ?? '—'}</div><div className="text-xs text-slate-400 mt-0.5">Doc: {cliente?.documento}</div></td>
                          <td className="table-cell text-sm text-slate-500 max-w-[200px] truncate">{v.detalle}</td>
                          <td className="table-cell text-slate-500 whitespace-nowrap">{v.fecha}</td>
                          <td className="table-cell font-bold text-emerald-600 text-right whitespace-nowrap">{v.tipo === 'nota_credito' ? '-' : ''}S/ {(v.total ?? 0).toLocaleString()}</td>
                          <td className="table-cell"><Badge label={v.estado} variant="success" /></td>
                          <td className="table-cell"><button className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors" title="Imprimir"><Printer size={16} /></button></td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} className="py-12 text-center text-slate-500">No se encontraron comprobantes</td></tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Emitir Comprobante" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo de Comprobante</label>
              <select className="input font-medium" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="boleta">Boleta de Venta Electrónica</option>
                <option value="factura">Factura Electrónica</option>
                <option value="nota_credito">Nota de Crédito</option>
                <option value="nota_debito">Nota de Débito</option>
              </select>
            </div>
            <div><label className="label">Fecha de Emisión</label><input type="date" className="input" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} /></div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="label">Cliente / Razón Social</label>
              <select className="input" value={form.clienteId} onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
                <option value="">-- Seleccionar cliente --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre} (Doc: {c.documento})</option>)}
              </select>
            </div>
            {(form.tipo === 'nota_credito' || form.tipo === 'nota_debito') && (
              <div><label className="label">Documento que modifica</label><input type="text" className="input" placeholder="Ej: F001-000001" /></div>
            )}
            <div><label className="label">Detalle / Concepto</label><input type="text" className="input" placeholder="Descripción del servicio o paquete..." value={form.detalle} onChange={e => setForm(f => ({ ...f, detalle: e.target.value }))} /></div>
            <div className="flex gap-4 items-end">
              <div className="flex-1"><label className="label">Importe Total (S/)</label><input type="number" className="input text-lg font-bold" placeholder="0.00" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} /></div>
              <div className="text-xs text-slate-500 pb-3">Incluye IGV (18%)</div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center"><Printer size={16} />{saving ? 'Emitiendo…' : 'Emitir y Descargar PDF'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
