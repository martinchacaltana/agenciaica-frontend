import { useState } from 'react';
import { Plus, Pencil, Search, DollarSign, Clock, Eye, ToggleRight, ToggleLeft } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import packageService from '../services/packageService';

const emptyForm = { destino: '', precio: '', duracion: '', descripcion: '', categoria: 'Cultural', imagen: '✈️', estado: 'activo' };
const categoriaVariant = { 'Arqueológico': 'warning', 'Naturaleza': 'success', 'Playa': 'info', 'Aventura': 'danger', 'Cultural': 'purple' };

export default function Packages() {
  const { data: pkgsRaw, loading, error, refetch } = useApi(() => packageService.getAll(), []);
  const pkgs = pkgsRaw ?? [];
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailPkg, setDetailPkg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState('grid');
  const [saving, setSaving] = useState(false);

  const categorias = ['todas', ...Array.from(new Set(pkgs.map(p => p.categoria).filter(Boolean)))];
  const filtered = pkgs.filter(p => {
    const matchSearch = p.destino.toLowerCase().includes(search.toLowerCase()) || (p.categoria ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'todas' || p.categoria === catFilter;
    return matchSearch && matchCat;
  });

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };
  const openEdit = (p) => { setForm({ ...p, precio: String(p.precio), duracion: String(p.duracion) }); setEditId(p.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.destino || !form.precio) return;
    const data = { ...form, precio: Number(form.precio), duracion: Number(form.duracion) };
    setSaving(true);
    try {
      editId ? await packageService.update(editId, data) : await packageService.create(data);
      setModalOpen(false);
      refetch();
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  const toggleEstado = async (id) => {
    try { await packageService.toggleEstado(id); refetch(); }
    catch (err) { alert(`Error: ${err.message}`); }
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="label">{label}</label>
      <input type={type} className="input" placeholder={placeholder}
        value={form[name] ?? ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
              placeholder="Buscar destino o categoría..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex rounded-xl border border-slate-200 overflow-x-auto bg-white text-sm">
            {categorias.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-2 font-medium transition-colors whitespace-nowrap ${catFilter === c ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-brand-600'}`}>
                {c === 'todas' ? 'Todas' : c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button onClick={() => setView('grid')} className={`px-3 py-2 text-sm font-medium transition-colors ${view === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500'}`}>Grid</button>
            <button onClick={() => setView('list')} className={`px-3 py-2 text-sm font-medium transition-colors ${view === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500'}`}>Lista</button>
          </div>
          <button onClick={openCreate} className="btn-primary shrink-0"><Plus size={16} /> Nuevo Paquete</button>
        </div>
      </div>

      {error && <ApiError message={error} onRetry={refetch} />}

      {!error && view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-200" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-16 bg-slate-100 rounded" />
            </div>
          )) : filtered.map(p => (
            <div key={p.id} className={`card hover:border-brand-300 transition-all duration-200 flex flex-col ${p.estado === 'inactivo' ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl border border-slate-100">{p.imagen}</div>
                <Badge label={p.estado === 'activo' ? 'Activo' : 'Inactivo'} variant={p.estado === 'activo' ? 'success' : 'danger'} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{p.destino}</h3>
              <Badge label={p.categoria} variant={categoriaVariant[p.categoria] ?? 'default'} />
              <p className="text-sm text-slate-500 mt-3 flex-1 line-clamp-2">{p.descripcion}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1"><DollarSign size={12} className="text-emerald-600" /><span className="font-semibold text-slate-900">S/ {(p.precio ?? 0).toLocaleString()}</span></div>
                <div className="flex items-center gap-1"><Clock size={12} className="text-brand-600" /><span>{p.duracion} día{p.duracion !== 1 ? 's' : ''}</span></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setDetailPkg(p)} className="btn-secondary text-sm py-2 px-3"><Eye size={13} /></button>
                <button onClick={() => openEdit(p)} className="btn-secondary flex-1 text-sm justify-center py-2"><Pencil size={13} /> Editar</button>
                <button onClick={() => toggleEstado(p.id)} className={`p-2 rounded-xl border transition-colors ${p.estado === 'activo' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-400 border-slate-200 bg-white'}`}>
                  {p.estado === 'activo' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!error && view === 'list' && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="table-header">Destino</th><th className="table-header">Categoría</th>
                  <th className="table-header">Precio base</th><th className="table-header">Duración</th>
                  <th className="table-header">Estado</th><th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={6} rows={6} /> : filtered.map(p => (
                  <tr key={p.id} className={`table-row ${p.estado === 'inactivo' ? 'opacity-60' : ''}`}>
                    <td className="table-cell"><div className="flex items-center gap-3"><span className="text-2xl">{p.imagen}</span><div><p className="font-semibold text-slate-800">{p.destino}</p><p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{p.descripcion}</p></div></div></td>
                    <td className="table-cell"><Badge label={p.categoria} variant={categoriaVariant[p.categoria] ?? 'default'} /></td>
                    <td className="table-cell font-semibold text-emerald-600">S/ {(p.precio ?? 0).toLocaleString()}</td>
                    <td className="table-cell">{p.duracion} día{p.duracion !== 1 ? 's' : ''}</td>
                    <td className="table-cell"><Badge label={p.estado === 'activo' ? 'Activo' : 'Inactivo'} variant={p.estado === 'activo' ? 'success' : 'danger'} /></td>
                    <td className="table-cell">
                      <div className="flex gap-1">
                        <button onClick={() => setDetailPkg(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => toggleEstado(p.id)} className={`p-1.5 rounded-lg transition-colors ${p.estado === 'activo' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                          {p.estado === 'activo' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      <Modal open={!!detailPkg} onClose={() => setDetailPkg(null)} title="Detalle del Paquete" size="md">
        {detailPkg && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl">{detailPkg.imagen}</div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{detailPkg.destino}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge label={detailPkg.categoria} variant={categoriaVariant[detailPkg.categoria] ?? 'default'} />
                  <Badge label={detailPkg.estado === 'activo' ? 'Activo' : 'Inactivo'} variant={detailPkg.estado === 'activo' ? 'success' : 'danger'} />
                </div>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{detailPkg.descripcion}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-2"><DollarSign size={18} className="text-emerald-600" /><div><p className="text-xs text-slate-500">Precio base</p><p className="font-bold text-slate-800">S/ {(detailPkg.precio ?? 0).toLocaleString()}</p></div></div>
              <div className="bg-brand-50 rounded-xl p-3 flex items-center gap-2"><Clock size={18} className="text-brand-600" /><div><p className="text-xs text-slate-500">Duración</p><p className="font-bold text-slate-800">{detailPkg.duracion} día{detailPkg.duracion !== 1 ? 's' : ''}</p></div></div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">💡 La disponibilidad y cupos se gestionan en el módulo de <strong className="text-slate-700">Salidas</strong>.</div>
            <button onClick={() => setDetailPkg(null)} className="btn-secondary w-full justify-center">Cerrar</button>
          </div>
        )}
      </Modal>

      {/* Modal Crear / Editar */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Paquete' : 'Nuevo Paquete Turístico'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Destino / Nombre" name="destino" placeholder="Ej: Huacachina & Buggies" />
            <Field label="Emoji / Ícono" name="imagen" placeholder="🏔️" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio base (S/)" name="precio" type="number" placeholder="180" />
            <Field label="Duración (días)" name="duracion" type="number" placeholder="1" />
          </div>
          <div>
            <label className="label">Categoría</label>
            <select className="input" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {['Arqueológico','Naturaleza','Playa','Aventura','Cultural'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input resize-none" rows={3} placeholder="Descripción del paquete turístico..."
              value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div>
            <label className="label">Estado</label>
            <div className="flex gap-3">
              {['activo','inactivo'].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, estado: s }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                    ${form.estado === s && s === 'activo' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : ''}
                    ${form.estado === s && s === 'inactivo' ? 'bg-red-50 border-red-400 text-red-600' : ''}
                    ${form.estado !== s ? 'bg-white border-slate-200 text-slate-400 hover:border-slate-300' : ''}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Guardando…' : editId ? 'Guardar cambios' : 'Crear paquete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
