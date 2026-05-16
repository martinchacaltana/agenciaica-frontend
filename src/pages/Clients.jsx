import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import clientService from '../services/clientService';

const emptyForm = { nombre: '', email: '', telefono: '', documento: '', estado: 'activo' };

export default function Clients() {
  const { data: clients, loading, error, refetch } = useApi(
    () => clientService.getAll(),
    []
  );

  const [search, setSearch]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving]     = useState(false);

  const list = clients ?? [];

  const filtered = list.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.documento ?? '').includes(search)
  );

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };
  const openEdit   = (c) => { setForm({ ...c }); setEditId(c.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.nombre || !form.email) return;
    setSaving(true);
    try {
      if (editId) {
        await clientService.update(editId, form);
      } else {
        await clientService.create(form);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await clientService.remove(deleteId);
      setDeleteId(null);
      refetch();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        placeholder={placeholder}
        value={form[name] || ''}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
      />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-72">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
            placeholder="Buscar por nombre, email o documento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>

      {/* Stats row */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',    v: list.length,                                   icon: '👥' },
            { label: 'Activos',  v: list.filter(c => c.estado === 'activo').length,   icon: '✅' },
            { label: 'Inactivos',v: list.filter(c => c.estado === 'inactivo').length, icon: '⏸️' },
            { label: 'Nuevos',   v: list.filter(c => c.creado?.startsWith(new Date().toISOString().slice(0,7))).length, icon: '📅' },
          ].map(({ label, v, icon }) => (
            <div key={label} className="card-sm flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-2xl font-bold text-slate-900">{v}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Lista de Clientes</h3>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length} clientes encontrados</p>
        </div>

        {error ? (
          <ApiError message={error} onRetry={refetch} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Teléfono</th>
                  <th className="table-header">Documento</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Registrado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton cols={7} rows={6} />
                ) : (
                  <>
                    {filtered.map(c => (
                      <tr key={c.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {c.nombre.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-800">{c.nombre}</span>
                          </div>
                        </td>
                        <td className="table-cell text-slate-400">{c.email}</td>
                        <td className="table-cell">{c.telefono}</td>
                        <td className="table-cell font-mono text-slate-400">{c.documento}</td>
                        <td className="table-cell">
                          <Badge
                            label={c.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            variant={c.estado === 'activo' ? 'success' : 'danger'}
                          />
                        </td>
                        <td className="table-cell text-slate-400">{c.creado}</td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          No se encontraron clientes
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <div className="space-y-4">
          <Field label="Nombre completo"       name="nombre"    placeholder="Ej: María García" />
          <Field label="Correo electrónico"    name="email"     type="email" placeholder="correo@ejemplo.com" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Teléfono"            name="telefono"  placeholder="+51 987 654 321" />
            <Field label="Documento (DNI/CE)"  name="documento" placeholder="12345678" />
          </div>
          <div>
            <label className="label">Estado</label>
            <select className="input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Guardando…' : editId ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Eliminar Cliente" size="sm">
        <div className="space-y-4">
          <p className="text-slate-500 text-sm">¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleDelete} disabled={saving} className="btn-danger flex-1 justify-center">
              {saving ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
