import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, CalendarCheck, CreditCard,
  Plane, ChevronRight, X, FileText, UserCog, Bus,
} from 'lucide-react';

const operaciones = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/clientes',     icon: Users,           label: 'Clientes'     },
  { to: '/reservas',     icon: CalendarCheck,   label: 'Reservas'     },
  { to: '/pagos',        icon: CreditCard,      label: 'Pagos'        },
  { to: '/comprobantes', icon: FileText,        label: 'Comprobantes' },
];

const catalogo = [
  { to: '/paquetes', icon: Package, label: 'Paquetes'  },
  { to: '/salidas',  icon: Bus,     label: 'Salidas'   },
];

const administracion = [
  { to: '/personal', icon: UserCog, label: 'Personal' },
];

function NavSection({ title, items, onClose }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
        {title}
      </p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onClose}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200 group relative
            ${isActive
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-400/20'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }
          `}
        >
          <Icon size={18} className="shrink-0" />
          <span className="flex-1">{label}</span>
          <ChevronRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-30
          flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/50">
              <Plane size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm tracking-tight">Agencia de Viajes Ica</p>
              <p className="text-xs text-slate-400">Admin System</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <NavSection title="Operaciones" items={operaciones} onClose={onClose} />
          <div className="border-t border-slate-100 my-2" />
          <NavSection title="Catálogo" items={catalogo} onClose={onClose} />
          <div className="border-t border-slate-100 my-2" />
          <NavSection title="Administración" items={administracion} onClose={onClose} />
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">admin@travelpro.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
