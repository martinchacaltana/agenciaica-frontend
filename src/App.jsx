import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Packages from './pages/Packages';
import Reservations from './pages/Reservations';
import Payments from './pages/Payments';
import Vouchers from './pages/Vouchers';
import Staff from './pages/Staff';
import Salidas from './pages/Salidas';

/** Ruta protegida: redirige a /login si no hay sesión activa */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/** Ruta pública: si ya está logueado, redirige al dashboard */
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index            element={<Dashboard />} />
            <Route path="clientes"     element={<Clients />} />
            <Route path="paquetes"     element={<Packages />} />
            <Route path="salidas"      element={<Salidas />} />
            <Route path="reservas"     element={<Reservations />} />
            <Route path="pagos"        element={<Payments />} />
            <Route path="comprobantes" element={<Vouchers />} />
            <Route path="personal"     element={<Staff />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
