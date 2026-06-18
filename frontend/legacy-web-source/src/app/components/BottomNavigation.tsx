import { Home, Package, Receipt, FileText, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/home', icon: <Home className="w-6 h-6" />, label: 'Home' },
  { path: '/barang', icon: <Package className="w-6 h-6" />, label: 'Barang' },
  { path: '/transaksi', icon: <Receipt className="w-6 h-6" />, label: 'Transaksi' },
  { path: '/laporan', icon: <FileText className="w-6 h-6" />, label: 'Laporan' },
  { path: '/profil', icon: <User className="w-6 h-6" />, label: 'Profil' }
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg max-w-[390px] mx-auto">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
