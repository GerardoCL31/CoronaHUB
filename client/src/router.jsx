import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/Home.jsx"));
const Carta = lazy(() => import("./pages/Carta.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Reservation = lazy(() => import("./pages/Reservation.jsx"));
const Eventos = lazy(() => import("./pages/Eventos.jsx"));
const Galeria = lazy(() => import("./pages/Galeria.jsx"));
const Legal = lazy(() => import("./pages/Legal.jsx"));
const AdminLogin = lazy(() => import("./pages/admin/Login.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));

const hasToken = () => Boolean(localStorage.getItem("coronahub_token"));

function ProtectedRoute({ children }) {
  if (!hasToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loader" aria-live="polite">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carta" element={<Carta />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
