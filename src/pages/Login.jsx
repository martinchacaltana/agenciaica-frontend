import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Loader2, MapPin, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.message ?? 'Credenciales incorrectas.');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-hidden">

      {/* ── Panel izquierdo — branding ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Fondo gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700" />

        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Círculos decorativos */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Contenido */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Plane size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Ica Tours Admin</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Gestiona tu<br />
              <span className="text-brand-200">agencia de viajes</span><br />
              con facilidad
            </h1>
            <p className="mt-4 text-brand-100/80 text-lg leading-relaxed max-w-md">
              Control total de reservas, paquetes, clientes y pagos desde un solo panel administrativo.
            </p>
          </div>

          {/* Chips de destinos */}
          <div className="flex flex-wrap gap-2">
            {['🏜️ Huacachina', '🚤 Islas Ballestas', '🌊 Paracas', '✈️ Líneas de Nazca', '🍷 Bodegas de Ica'].map(d => (
              <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white/90 text-sm font-medium border border-white/10">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 flex items-center gap-2 text-brand-100/60 text-sm">
          <MapPin size={14} />
          <span>Ica, Perú · Sistema de gestión turística</span>
        </div>
      </div>

      {/* ── Panel derecho — formulario ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-950">
        <div className="w-full max-w-md animate-fade-in">

          {/* Logo (solo en mobile) */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <Plane size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">Ica Tours Admin</span>
          </div>

          {/* Cabecera formulario */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
            <p className="mt-1.5 text-slate-400">Inicia sesión para continuar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Usuario
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="tu.usuario"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
                    disabled:opacity-50 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500
                    focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
                    disabled:opacity-50 transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error inline */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <span className="text-red-400 text-sm leading-snug">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500
                text-white font-semibold py-3 rounded-xl transition-all duration-200
                shadow-lg shadow-brand-900/50 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Iniciando sesión…
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-slate-600">
            Sistema administrativo — Agencia de Viajes Ica
          </p>
        </div>
      </div>

      {/* Animación de entrada */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.45s ease both;
        }
      `}</style>
    </div>
  );
}
