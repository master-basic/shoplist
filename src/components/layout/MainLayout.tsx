import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useStoreContext } from '../../store/useStore';
import {
  Home,
  Scan,
  BarChart,
  Search,
  User,
  List as ListIcon,
  LogOut,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { lists } = useStoreContext();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ListIcon, label: 'Lists', path: '/lists' },
    { icon: Scan, label: 'Scan', path: '/scan' },
    { icon: BarChart, label: 'Reports', path: '/reports' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-4">
            <h1 className="text-xl font-bold text-green-600">🛒 GroceryMind</h1>
          </div>
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-6 gap-1 px-2 py-2">
            <a
              href="/"
              className={`flex flex-col items-center justify-center py-1 ${
                location.pathname === '/' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </a>
            <a
              href="/lists"
              className={`flex flex-col items-center justify-center py-1 ${
                location.pathname === '/lists' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <ListIcon className="w-6 h-6" />
              <span className="text-xs">Lists</span>
            </a>
            <a
              href="/scan"
              className={`flex flex-col items-center justify-center py-1 ${
                location.pathname === '/scan' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Scan className="w-6 h-6" />
              <span className="text-xs">Scan</span>
            </a>
            <a
              href="/reports"
              className={`flex flex-col items-center justify-center py-1 ${
                location.pathname === '/reports' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <BarChart className="w-6 h-6" />
              <span className="text-xs">Reports</span>
            </a>
            <a
              href="/search"
              className={`flex flex-col items-center justify-center py-1 ${
                location.pathname === '/search' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="text-xs">Search</span>
            </a>
            <a
              href="/profile"
              className={`flex flex-col items-center justify-center py-1 ${
                location.pathname === '/profile' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;