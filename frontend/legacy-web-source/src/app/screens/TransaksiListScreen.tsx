import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Calendar, Receipt } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Badge } from '../components/Badge';

const transaksiData = [
  { id: 'TRX001', date: '2026-04-27', time: '10:30', items: 3, total: 'Rp 150.000', status: 'Selesai' },
  { id: 'TRX002', date: '2026-04-27', time: '11:15', items: 2, total: 'Rp 85.000', status: 'Selesai' },
  { id: 'TRX003', date: '2026-04-27', time: '13:45', items: 5, total: 'Rp 275.000', status: 'Selesai' },
  { id: 'TRX004', date: '2026-04-26', time: '09:20', items: 4, total: 'Rp 180.000', status: 'Selesai' },
  { id: 'TRX005', date: '2026-04-26', time: '14:30', items: 1, total: 'Rp 45.000', status: 'Selesai' }
];

export function TransaksiListScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransaksi = transaksiData.filter(t =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout showNavigation>
      <div className="h-full overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <h1 className="text-2xl mb-4">Transaksi Penjualan</h1>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode transaksi..."
            className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">
              Riwayat Transaksi ({filteredTransaksi.length})
            </h3>
            <button className="flex items-center gap-2 text-primary hover:underline">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {filteredTransaksi.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-4">Tidak ada transaksi ditemukan</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransaksi.map((transaksi) => (
                <Card
                  key={transaksi.id}
                  onClick={() => navigate(`/transaksi/${transaksi.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="mb-1">{transaksi.id}</h4>
                        <div className="text-sm text-muted-foreground">
                          {transaksi.date} • {transaksi.time}
                        </div>
                      </div>
                    </div>
                    <Badge variant="success">{transaksi.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      {transaksi.items} item
                    </div>
                    <div className="text-lg text-primary">{transaksi.total}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <FloatingActionButton
          icon={<Plus className="w-6 h-6" />}
          onClick={() => navigate('/transaksi/tambah')}
        />
      </div>
    </MobileLayout>
  );
}
