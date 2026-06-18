import { useNavigate } from 'react-router';
import { Store, User, Mail, Users, HelpCircle, LogOut, ChevronRight, Settings } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';

const menuItems = [
  {
    category: 'Informasi Akun',
    items: [
      { icon: <Store className="w-5 h-5" />, label: 'Nama Toko', value: 'Toko Berkah Jaya', path: null },
      { icon: <User className="w-5 h-5" />, label: 'Nama Pemilik', value: 'Budi Santoso', path: null },
      { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'budi@tokoberkah.com', path: null }
    ]
  },
  {
    category: 'Pengaturan',
    items: [
      { icon: <Settings className="w-5 h-5" />, label: 'Pengaturan Akun', value: null, path: '/profil/pengaturan' },
      { icon: <Users className="w-5 h-5" />, label: 'Kelola User/Admin', value: null, path: '/profil/users' }
    ]
  },
  {
    category: 'Lainnya',
    items: [
      { icon: <HelpCircle className="w-5 h-5" />, label: 'Bantuan & Dukungan', value: null, path: '/profil/bantuan' }
    ]
  }
];

export function ProfilScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      navigate('/login');
    }
  };

  return (
    <MobileLayout showNavigation>
      <div className="h-full overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-12 rounded-b-3xl">
          <h1 className="text-2xl mb-6">Profil & Pengaturan</h1>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Store className="w-12 h-12" />
            </div>
            <h2 className="text-xl mb-1">Toko Berkah Jaya</h2>
            <p className="text-primary-foreground/90">Budi Santoso</p>
          </div>
        </div>

        <div className="p-6 -mt-6 space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm text-muted-foreground mb-3 px-2">
                {section.category}
              </h3>
              <Card padding={false}>
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center justify-between p-4 ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                    } ${item.path ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-muted-foreground flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-0.5">{item.label}</div>
                        {item.value && (
                          <div className="text-sm text-muted-foreground truncate">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.path && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </Card>
            </div>
          ))}

          <Card
            onClick={handleLogout}
            className="cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-center gap-2 text-destructive">
              <LogOut className="w-5 h-5" />
              <span>Keluar dari Akun</span>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>KonsinyasiKu v1.0.0</p>
            <p>© 2026 All Rights Reserved</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
