import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import { Login } from './pages/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Vehicules } from './pages/Vehicules';
import { Pieces } from './pages/Pieces';
import { Allocations } from './pages/Allocations';
import { Facturation } from './pages/Facturation';
import { Clients } from './pages/Clients';
import { Approvisionnements } from './pages/Approvisionnements';
import { Parametres } from './pages/Parametres';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { estConnecte } = useApp();
  return estConnecte ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { estConnecte } = useApp();
  return !estConnecte ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vehicules" element={<Vehicules />} />
        <Route path="pieces" element={<Pieces />} />
        <Route path="allocations" element={<Allocations />} />
        <Route path="facturation" element={<Facturation />} />
        <Route path="clients" element={<Clients />} />
        <Route path="approvisionnements" element={<Approvisionnements />} />
        <Route path="parametres" element={<Parametres />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1e293b',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#3B82F6',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
