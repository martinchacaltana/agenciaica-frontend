import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, Search, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/':             'Dashboard',
  '/clientes':     'Gestión de Clientes',
  '/paquetes':     'Paquetes Turísticos',
  '/salidas':      'Gestión de Salidas',
  '/reservas':     'Gestión de Reservas',
  '/pagos':        'Pagos',
  '/comprobantes': 'Comprobantes',
  '/personal':     'Gestión de Personal',
};

/** Obtiene las iniciales del nombre o username del usuario */
function getInitials(user) {
  if (!user) return '??';
  const name = user.nombre ?? user.name ?? user.username ?? user.sub ?? '';
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || '??';
}

/** Obtiene el nombre de display del usuario */
function getDisplayName(user) {
  if (!user) return 'Usuario';
  return user.nombre ?? user.name ?? user.username ?? user.sub ?? 'Usuario';
}

/** Obtiene el rol del usuario */
function getRole(user) {
  if (!user) return '';
  return user.rol ?? user.role ?? user.authorities?.[0]?.replace('ROLE_', '') ?? '';
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const title = pageTitles[pathname] ?? 'Agencia de Viajes Ica';
  const initials = getInitials(user);
  const displayName = getDisplayName(user);
  const role = getRole(user);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 w-56">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              placeholder="Buscar..."
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 w-full"
            />
          </div>

          <button className="relative text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-xl hover:bg-slate-100">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
                {role && <p className="text-xs text-slate-400 capitalize leading-tight">{role}</p>}
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
                    {role && <p className="text-xs text-slate-400 capitalize">{role}</p>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
