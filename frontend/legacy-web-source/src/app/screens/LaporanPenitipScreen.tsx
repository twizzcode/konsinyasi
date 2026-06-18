import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, Package, DollarSign, TrendingUp } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const penitipList = [
  { id: '1', name: 'Bu Siti' },
  { id: '2', name: 'Pak Ahmad' },
  { id: '3', name: 'Bu Yuli' },
  { id: '4', name: 'Pak Budi' }
];

const penitipReport = {
  name: 'Bu Siti',
  totalItems: 12,
  itemsSold: 95,
  revenue: 1425000,
  supplierShare: 1140000,
  storeProfit: 285000,
  transactions: [
    { date: '2026-04-27', items: 3, amount: 45000 },
    { date: '2026-04-26', items: 5, amount: 75000 },
    { date: '2026-04-25', items: 2, amount: 30000 }
  ]
};

export function LaporanPenitipScreen() {
  const navigate = useNavigate();
  const [selectedPenitip, setSelectedPenitip] = useState('Bu Siti');

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
          <h1 className="text-2xl mb-4">Laporan per Penitip</h1>

          <select
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
            value={selectedPenitip}
            onChange={(e) => setSelectedPenitip(e.target.value)}
          >
            {penitipList.map((penitip) => (
              <option key={penitip.id} value={penitip.name} className="text-foreground">
                {penitip.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-2xl mb-1">{penitipReport.totalItems}</div>
              <div className="text-sm text-muted-foreground">Total Barang</div>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-2 text-info">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl mb-1">{penitipReport.itemsSold}</div>
              <div className="text-sm text-muted-foreground">Barang Terjual</div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg mb-3">Ringkasan Keuangan</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Pendapatan:</span>
                <span className="text-lg">{formatRupiah(penitipReport.revenue)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Bagian Penitip:</span>
                <span className="text-lg text-primary">{formatRupiah(penitipReport.supplierShare)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Keuntungan Toko:</span>
                <span className="text-lg text-success">{formatRupiah(penitipReport.storeProfit)}</span>
              </div>
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg">Riwayat Transaksi</h3>
            </div>
            <div className="space-y-2">
              {penitipReport.transactions.map((trx, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-1">{trx.date}</div>
                      <div className="text-sm text-muted-foreground">{trx.items} item terjual</div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary">{formatRupiah(trx.amount)}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Button
            fullWidth
            variant="outline"
            icon={<Download className="w-5 h-5" />}
            size="lg"
          >
            Export Laporan PDF
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
