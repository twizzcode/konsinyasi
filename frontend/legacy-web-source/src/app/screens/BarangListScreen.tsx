import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Filter, Package } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Badge } from '../components/Badge';

const barangData = [
  {
    id: '1',
    name: 'Minyak Goreng 1L',
    supplier: 'Bu Siti',
    price: 'Rp 15.000',
    stock: 25,
    minStock: 10,
    status: 'aman'
  },
  {
    id: '2',
    name: 'Gula Pasir 1kg',
    supplier: 'Pak Ahmad',
    price: 'Rp 18.000',
    stock: 3,
    minStock: 10,
    status: 'hampir habis'
  },
  {
    id: '3',
    name: 'Tepung Terigu',
    supplier: 'Bu Siti',
    price: 'Rp 12.000',
    stock: 0,
    minStock: 5,
    status: 'habis'
  },
  {
    id: '4',
    name: 'Mie Instan',
    supplier: 'Bu Yuli',
    price: 'Rp 3.500',
    stock: 45,
    minStock: 20,
    status: 'aman'
  }
];

export function BarangListScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  const filteredBarang = barangData.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'semua' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'aman':
        return <Badge variant="success">Aman</Badge>;
      case 'hampir habis':
        return <Badge variant="warning">Hampir Habis</Badge>;
      case 'habis':
        return <Badge variant="danger">Habis</Badge>;
      default:
        return null;
    }
  };

  return (
    <MobileLayout showNavigation>
      <div className="h-full overflow-y-auto pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <h1 className="text-2xl mb-4">Barang Konsinyasi</h1>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">
              Daftar Barang ({filteredBarang.length})
            </h3>
            <button className="flex items-center gap-2 text-primary hover:underline">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {['semua', 'aman', 'hampir habis', 'habis'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredBarang.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-4">Tidak ada barang ditemukan</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBarang.map((barang) => (
                <Card
                  key={barang.id}
                  onClick={() => navigate(`/barang/${barang.id}`)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate mb-1">{barang.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            Penitip: {barang.supplier}
                          </div>
                        </div>
                        {getStockBadge(barang.status)}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="text-primary">{barang.price}</div>
                        <div className="text-sm text-muted-foreground">
                          Stok: {barang.stock}
                        </div>
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
          onClick={() => navigate('/barang/tambah')}
        />
      </div>
    </MobileLayout>
  );
}
