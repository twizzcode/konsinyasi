import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, DollarSign, Package, Download, ChevronRight, Users } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const periods = ['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Custom'];

const topProducts = [
  { name: 'Minyak Goreng 1L', sold: 45, revenue: 'Rp 675.000' },
  { name: 'Gula Pasir 1kg', sold: 38, revenue: 'Rp 684.000' },
  { name: 'Mie Instan', sold: 120, revenue: 'Rp 420.000' }
];

const reportsByPeriod = [
  { period: 'April 2026', sales: 'Rp 15.500.000', profit: 'Rp 3.100.000' },
  { period: 'Maret 2026', sales: 'Rp 14.200.000', profit: 'Rp 2.840.000' },
  { period: 'Februari 2026', sales: 'Rp 13.800.000', profit: 'Rp 2.760.000' }
];

export function LaporanScreen() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('Bulan Ini');

  const formatRupiah = (amount: string) => amount;

  return (
    <MobileLayout showNavigation>
      <div className="h-full overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <h1 className="text-2xl mb-4">Laporan</h1>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-primary'
                    : 'bg-white/10 text-primary-foreground hover:bg-white/20'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl mb-1">Rp 15.5jt</div>
              <div className="text-sm text-muted-foreground">Total Penjualan</div>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-2 text-success">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-2xl mb-1">Rp 3.1jt</div>
              <div className="text-sm text-muted-foreground">Keuntungan Toko</div>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-2 text-warning">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-2xl mb-1">Rp 12.4jt</div>
              <div className="text-sm text-muted-foreground">Bagian Penitip</div>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-2 text-info">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-2xl mb-1">428</div>
              <div className="text-sm text-muted-foreground">Barang Terjual</div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg">Grafik Penjualan</h3>
            </div>
            <div className="h-40 bg-muted rounded-xl flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Grafik penjualan {selectedPeriod.toLowerCase()}</div>
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg">Barang Terlaris</h3>
            </div>
            <div className="space-y-2">
              {topProducts.map((product, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary w-10 h-10 rounded-xl flex items-center justify-center">
                        <span>#{index + 1}</span>
                      </div>
                      <div>
                        <div>{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.sold} terjual</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-success">{product.revenue}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card onClick={() => navigate('/laporan/penitip')} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div>Laporan per Penitip</div>
                  <div className="text-sm text-muted-foreground">Lihat detail per penitip</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg">Laporan Per Periode</h3>
              <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </div>
            <div className="space-y-2">
              {reportsByPeriod.map((report, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-1">{report.period}</div>
                      <div className="text-sm text-muted-foreground">
                        Penjualan: {report.sales}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-success">{report.profit}</div>
                      <div className="text-xs text-muted-foreground">Profit</div>
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
