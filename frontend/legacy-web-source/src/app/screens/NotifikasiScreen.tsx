import { useNavigate } from 'react-router';
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Package, FileText } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Stok Hampir Habis',
    message: 'Minyak Goreng 1L tersisa 3 unit',
    time: '5 menit lalu',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: '2',
    type: 'warning',
    title: 'Stok Habis',
    message: 'Tepung Terigu stok habis, segera isi ulang',
    time: '1 jam lalu',
    icon: <Package className="w-5 h-5" />
  },
  {
    id: '3',
    type: 'success',
    title: 'Transaksi Berhasil',
    message: 'Transaksi TRX001 berhasil disimpan',
    time: '2 jam lalu',
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    id: '4',
    type: 'info',
    title: 'Laporan Siap',
    message: 'Laporan bulan April 2026 siap diunduh',
    time: '3 jam lalu',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: '5',
    type: 'warning',
    title: 'Stok Hampir Habis',
    message: 'Gula Pasir 1kg tersisa 2 unit',
    time: '4 jam lalu',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    id: '6',
    type: 'success',
    title: 'Penitip Baru Ditambahkan',
    message: 'Bu Yuli berhasil ditambahkan sebagai penitip',
    time: '1 hari lalu',
    icon: <CheckCircle className="w-5 h-5" />
  }
];

export function NotifikasiScreen() {
  const navigate = useNavigate();

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'info':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">Notifikasi</h1>
            <button className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Tandai Semua Dibaca
            </button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Info className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-4">Tidak ada notifikasi</div>
            </div>
          ) : (
            notifications.map((notif) => (
              <Card key={notif.id} className="hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${getNotificationColor(notif.type)}`}>
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium">{notif.title}</h4>
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{notif.message}</p>
                    <p className="text-xs text-muted-foreground">{notif.time}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
