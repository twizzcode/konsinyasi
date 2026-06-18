import { useNavigate } from 'react-router';
import { Package, TrendingUp, DollarSign, AlertTriangle, Plus, Users, Receipt, FileText, Bell } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const statsData = [
  { label: 'Total Barang Titipan', value: '48', icon: <Package className="w-6 h-6" />, color: 'text-primary' },
  { label: 'Penjualan Hari Ini', value: 'Rp 850.000', icon: <TrendingUp className="w-6 h-6" />, color: 'text-success' },
  { label: 'Keuntungan Toko', value: 'Rp 340.000', icon: <DollarSign className="w-6 h-6" />, color: 'text-warning' },
  { label: 'Stok Hampir Habis', value: '5', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-destructive' }
];

const recentTransactions = [
  { id: 'TRX001', time: '10:30', items: 3, amount: 'Rp 150.000' },
  { id: 'TRX002', time: '11:15', items: 2, amount: 'Rp 85.000' },
  { id: 'TRX003', time: '13:45', items: 5, amount: 'Rp 275.000' }
];

const lowStockItems = [
  { name: 'Minyak Goreng 1L', stock: 3, supplier: 'Bu Siti' },
  { name: 'Gula Pasir 1kg', stock: 2, supplier: 'Pak Ahmad' },
  { name: 'Tepung Terigu', stock: 4, supplier: 'Bu Siti' }
];

const shortcuts = [
  { label: 'Tambah Barang', icon: <Package className="w-6 h-6" />, path: '/barang/tambah', color: 'bg-primary' },
  { label: 'Tambah Penitip', icon: <Users className="w-6 h-6" />, path: '/penitip/tambah', color: 'bg-success' },
  { label: 'Transaksi Baru', icon: <Receipt className="w-6 h-6" />, path: '/transaksi/tambah', color: 'bg-warning' },
  { label: 'Laporan', icon: <FileText className="w-6 h-6" />, path: '/laporan', color: 'bg-info' }
];

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <MobileLayout showNavigation>
      <div className="h-full overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl mb-1">Selamat Datang!</h1>
              <p className="text-primary-foreground/90">Toko Berkah Jaya</p>
            </div>
            <button
              onClick={() => navigate('/notifikasi')}
              className="relative p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statsData.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground">
                <div className="flex items-start justify-between mb-2">
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg mb-3">Menu Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map((shortcut, index) => (
                <Card
                  key={index}
                  onClick={() => navigate(shortcut.path)}
                  className="hover:shadow-lg transition-shadow"
                >
                  <div className={`${shortcut.color} text-white w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                    {shortcut.icon}
                  </div>
                  <div className="text-sm">{shortcut.label}</div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg">Transaksi Terbaru</h3>
              <button
                onClick={() => navigate('/transaksi')}
                className="text-sm text-primary hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((trx) => (
                <Card key={trx.id} onClick={() => navigate(`/transaksi/${trx.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <div>
                        <div>{trx.id}</div>
                        <div className="text-sm text-muted-foreground">{trx.time} • {trx.items} item</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>{trx.amount}</div>
                      <Badge variant="success" size="sm">Selesai</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg">Barang Hampir Habis</h3>
              <Badge variant="danger">{lowStockItems.length}</Badge>
            </div>
            <div className="space-y-2">
              {lowStockItems.map((item, index) => (
                <Card key={index} onClick={() => navigate('/barang')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div>{item.name}</div>
                      <div className="text-sm text-muted-foreground">Penitip: {item.supplier}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">Stok: {item.stock}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
