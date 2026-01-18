import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
  { icon: Car, label: 'Véhicules', path: '/vehicules' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: ClipboardList, label: 'Allocations', path: '/allocations' },
  { icon: Package, label: 'Pièces & Stock', path: '/pieces' },
  { icon: ShoppingCart, label: 'Approvisionnements', path: '/approvisionnements' },
  { icon: FileText, label: 'Facturation', path: '/facturation' },
  { icon: Settings, label: 'Paramètres', path: '/parametres' },
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deconnecter } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const isDesktopWidth = window.innerWidth >= 1024;
      setIsDesktop(isDesktopWidth);
      if (isDesktopWidth) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    deconnecter();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay pour mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Statique et fixe */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (sidebarOpen ? 0 : '-100%'),
        }}
        className="fixed left-0 top-0 bottom-0 w-64 shadow-lg z-50 lg:z-30"
        style={{
          backgroundColor: 'var(--sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--sidebar-primary)' }}>
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--sidebar-foreground)' }}>
                Flotte Pro
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--sidebar-foreground)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'var(--sidebar-accent)' : 'transparent',
                    color: isActive ? 'var(--sidebar-primary)' : 'var(--sidebar-foreground)',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isActive ? 'var(--sidebar-primary)' : 'var(--sidebar-foreground)' }}
                  />
                  <span className="font-medium text-sm lg:text-base">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
              style={{ 
                color: 'var(--destructive)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm lg:text-base">Déconnexion</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content avec Navbar */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Navbar - Statique et fixe */}
        <nav className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-card border-b border-border shadow-sm z-20">
          <div className="h-full flex items-center justify-between px-4 lg:px-6">
            {/* Menu Hamburger pour mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative ml-2 lg:ml-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-9 lg:pl-10 pr-4 py-2 text-sm lg:text-base rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </motion.button>

              {/* User Profile */}
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs lg:text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground hidden lg:block">Administrateur</p>
                </div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs lg:text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 mt-16 p-3 sm:p-4 lg:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
