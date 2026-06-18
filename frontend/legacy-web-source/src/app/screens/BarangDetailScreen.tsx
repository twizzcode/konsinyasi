import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Package, Edit, Plus, ShoppingCart, User, DollarSign, Percent } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const salesHistory = [
  { date: '2026-04-27', quantity: 3, total: 'Rp 45.000' },
  { date: '2026-04-26', quantity: 5, total: 'Rp 75.000' },
  { date: '2026-04-25', quantity: 2, total: 'Rp 30.000' }
];

export function BarangDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="px-6 -mt-4 pb-6 space-y-4">
          <Card className="overflow-hidden" padding={false}>
            <div className="aspect-square bg-muted flex items-center justify-center">
              <Package className="w-24 h-24 text-muted-foreground" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h2 className="text-xl mb-2">Minyak Goreng 1L</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="w-4 h-4" />
                    <span>Penitip: Bu Siti</span>
                  </div>
                </div>
                <Badge variant="success">Aman</Badge>
              </div>
              <div className="text-2xl text-primary">Rp 15.000</div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg mb-3">Informasi Stok</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Stok Tersedia</div>
                <div className="text-xl">25 unit</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Minimal Stok</div>
                <div className="text-xl">10 unit</div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg mb-3">Informasi Bagi Hasil</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Bagian Penitip</span>
                </div>
                <div>Rp 12.000 (80%)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Percent className="w-4 h-4" />
                  <span>Bagian Toko</span>
                </div>
                <div className="text-success">Rp 3.000 (20%)</div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg mb-3">Riwayat Penjualan</h3>
            <div className="space-y-2">
              {salesHistory.map((sale, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <div className="text-sm text-muted-foreground">{sale.date}</div>
                    <div className="text-sm">{sale.quantity} unit terjual</div>
                  </div>
                  <div>{sale.total}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/barang/${id}/edit`)}
              className="flex-col h-auto py-4"
            >
              <Edit className="w-5 h-5 mb-1" />
              <span className="text-xs">Edit</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
            >
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-xs">Tambah Stok</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/transaksi/tambah')}
              className="flex-col h-auto py-4"
            >
              <ShoppingCart className="w-5 h-5 mb-1" />
              <span className="text-xs">Jual</span>
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
