import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Phone, Package, DollarSign, Plus, Filter } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';
import { FloatingActionButton } from '../components/FloatingActionButton';

const penitipData = [
  { id: '1', name: 'Bu Siti', phone: '081234567890', itemCount: 12, totalSales: 'Rp 2.500.000' },
  { id: '2', name: 'Pak Ahmad', phone: '081234567891', itemCount: 8, totalSales: 'Rp 1.800.000' },
  { id: '3', name: 'Bu Yuli', phone: '081234567892', itemCount: 15, totalSales: 'Rp 3.200.000' },
  { id: '4', name: 'Pak Budi', phone: '081234567893', itemCount: 6, totalSales: 'Rp 950.000' }
];

export function PenitipListScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPenitip = penitipData.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MobileLayout showNavigation>
      <div className="h-full overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <h1 className="text-2xl mb-4">Manajemen Penitip</h1>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">
              Daftar Penitip ({filteredPenitip.length})
            </h3>
            <button className="flex items-center gap-2 text-primary hover:underline">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {filteredPenitip.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">Tidak ada penitip ditemukan</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPenitip.map((penitip) => (
                <Card
                  key={penitip.id}
                  onClick={() => navigate(`/penitip/${penitip.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg mb-1">{penitip.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{penitip.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Jumlah Barang</div>
                        <div>{penitip.itemCount} item</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-success" />
                      <div>
                        <div className="text-sm text-muted-foreground">Total Penjualan</div>
                        <div>{penitip.totalSales}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <FloatingActionButton
          icon={<Plus className="w-6 h-6" />}
          onClick={() => navigate('/penitip/tambah')}
        />
      </div>
    </MobileLayout>
  );
}
