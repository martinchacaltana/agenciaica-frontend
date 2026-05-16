import { useState } from 'react';
import { Plus, Pencil, Search, Shield, ShoppingBag, Wrench, ToggleLeft, ToggleRight, Users, UserCog } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useApi } from '../hooks/useApi';
import { TableSkeleton, ApiError } from '../hooks/ApiComponents';
import staffService from '../services/staffService';

const rolConfig = {
  admin:    { label: 'Admin',    variant: 'purple', icon: Shield      },
  vendedor: { label: 'Vendedor', variant: 'info',   icon: ShoppingBag },
  operador: { label: 'Operador', variant: 'warning', icon: Wrench     },
};

const avatarGradient = {
  admin:    'from-violet-500 to-purple-700',
  vendedor: 'from-sky-500 to-blue-700',
  operador: 'from-amber-400 to-orange-600',
};

const emptyForm = { nombre: '', documento: '', rol: 'vendedor', correo: '', telefono: '', estado: 'activo' };

const initials = (name) => name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

export default function Staff() {
  const { data: staffRaw, loading, error, refetch } = useApi(() => staffService.getAll(), []);
  const employees = staffRaw ?? [];

  const [search, setSearch]       = useState('');
  const [rolFilter, setRolFilter] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  const filtered = employees.filter(e => {
    const matchSearch = e.nombre.toLowerCase().includes(search.toLowerCase()) || (e.documento ?? '').includes(search);
    const matchRol = rolFilter === 'todos' || e.rol === rolFilter;
    return matchSearch && matchRol;
  });

  const totalActivos = employees.filter(e => e.estado === 'activo').length;
  const countByRol   = (rol) => employees.filter(e => e.rol === rol).length;

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModalOpen(true); };
  const openEdit   = (e) => { setForm({ ...e }); setEditId(e.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.nombre || !form.documento) return;
    setSaving(true);
    try {
      editId ? await staffService.update(editId, form) : await staffService.create(form);
      setModalOpen(false);
      refetch();
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  const toggleEstado = async (id) => {
    try { await staffService.toggleEstado(id); refetch(); }
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total personal', value: employees.length, icon: Users,       color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Admins',         value: countByRol('admin'),    icon: Shield,      color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Vendedores',     value: countByRol('vendedor'), icon: ShoppingBag, color: 'text-sky-600',    bg: 'bg-sky-50' },
          { label: 'Operadores',     value: countByRol('operador'), icon: Wrench,      color: 'text-amber-600',  bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon size={18} className={color} /></div>
            <div><p className="text-2xl font-bold text-slate-800">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1"
              placeholder="Buscar por nombre o documento..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white text-sm">
            {['todos', 'admin', 'vendedor', 'operador'].map(r => (
              <button key={r} onClick={() => setRolFilter(r)}
                className={`px-3 py-2 font-medium transition-colors capitalize ${rolFilter === r ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-brand-600'}`}>
                {r === 'todos' ? 'Todos' : rolConfig[r]?.label ?? r}
              </button>
            ))}
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0"><Plus size={16} /> Nuevo Personal</button>
      </div>

      {error ? <ApiError message={error} onRetry={refetch} /> : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="table-header">Empleado</th><th className="table-header">Documento</th>
                  <th className="table-header">Rol</th><th className="table-header hidden md:table-cell">Correo</th>
                  <th className="table-header hidden lg:table-cell">Teléfono</th>
                  <th className="table-header">Estado</th><th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton cols={7} rows={6} /> : (
                  <>
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">No se encontraron empleados.</td></tr>
                    )}
                    {filtered.map(emp => {
                      const RolIcon = rolConfig[emp.rol]?.icon ?? UserCog;
                      return (
                        <tr key={emp.id} className="table-row">
                          <td className="table-cell">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient[emp.rol] ?? 'from-slate-400 to-slate-600'} flex items-center justify-center text-xs font-bold text-white shrink-0`}>{initials(emp.nombre)}</div>
                              <div><p className="font-semibold text-slate-800 text-sm">{emp.nombre}</p><p className="text-xs text-slate-400">Desde {emp.creado}</p></div>
                            </div>
                          </td>
                          <td className="table-cell font-mono text-xs text-slate-600">{emp.documento}</td>
                          <td className="table-cell">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                              ${emp.rol === 'admin'    ? 'bg-violet-100 text-violet-700' : ''}
                              ${emp.rol === 'vendedor' ? 'bg-sky-100 text-sky-700'       : ''}
                              ${emp.rol === 'operador' ? 'bg-amber-100 text-amber-700'   : ''}`}>
                              <RolIcon size={11} />{rolConfig[emp.rol]?.label ?? emp.rol}
                            </span>
                          </td>
                          <td className="table-cell hidden md:table-cell text-slate-500">{emp.correo}</td>
                          <td className="table-cell hidden lg:table-cell text-slate-500">{emp.telefono}</td>
                          <td className="table-cell">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${emp.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${emp.estado === 'activo' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                              {emp.estado === 'activo' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="table-cell">
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"><Pencil size={14} /></button>
                              <button onClick={() => toggleEstado(emp.id)} className={`p-1.5 rounded-lg transition-colors ${emp.estado === 'activo' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                                {emp.estado === 'activo' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                              </button>
                            </div>
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
            {filtered.length} empleado{filtered.length !== 1 ? 's' : ''} · {totalActivos} activo{totalActivos !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Editar Empleado' : 'Nuevo Empleado'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Field label="Nombre completo" name="nombre" placeholder="Ej: Roberto Salas" /></div>
            <Field label="Documento (DNI)" name="documento" placeholder="12345678" />
            <div>
              <label className="label">Rol</label>
              <select className="input" value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                <option value="admin">Admin</option>
                <option value="vendedor">Vendedor</option>
                <option value="operador">Operador</option>
              </select>
            </div>
            <Field label="Correo electrónico" name="correo" type="email" placeholder="nombre@agencia.com" />
            <Field label="Teléfono" name="telefono" placeholder="+51 987 000 000" />
          </div>
          <div>
            <label className="label">Estado</label>
            <div className="flex gap-3">
              {['activo', 'inactivo'].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, estado: s }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                    ${form.estado === s && s === 'activo'   ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : ''}
                    ${form.estado === s && s === 'inactivo' ? 'bg-red-50 border-red-400 text-red-600'             : ''}
                    ${form.estado !== s ? 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'       : ''}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {form.nombre && (
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradient[form.rol] ?? 'from-slate-400 to-slate-600'} flex items-center justify-center text-sm font-bold text-white`}>{initials(form.nombre)}</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{form.nombre}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full
                  ${form.rol === 'admin'    ? 'bg-violet-100 text-violet-700' : ''}
                  ${form.rol === 'vendedor' ? 'bg-sky-100 text-sky-700'       : ''}
                  ${form.rol === 'operador' ? 'bg-amber-100 text-amber-700'   : ''}`}>
                  {rolConfig[form.rol]?.label ?? form.rol}
                </span>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Guardando…' : editId ? 'Guardar cambios' : 'Crear empleado'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
