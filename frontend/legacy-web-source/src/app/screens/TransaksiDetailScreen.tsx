import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Printer, Share2, Receipt } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

const transaksiDetail = {
  id: 'TRX001',
  date: '2026-04-27',
  time: '10:30',
  items: [
    { name: 'Minyak Goreng 1L', quantity: 2, price: 15000, supplier: 'Bu Siti' },
    { name: 'Gula Pasir 1kg', quantity: 1, price: 18000, supplier: 'Pak Ahmad' }
  ],
  subtotal: 48000,
  supplierTotal: 38400,
  storeProfit: 9600,
  total: 48000,
  status: 'Selesai'
};

export function TransaksiDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl mb-1">{transaksiDetail.id}</h1>
              <p className="text-primary-foreground/90">
                {transaksiDetail.date} • {transaksiDetail.time}
              </p>
            </div>
            <Badge variant="success">{transaksiDetail.status}</Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Card>
            <h3 className="text-lg mb-3">Detail Barang</h3>
            <div className="space-y-3">
              {transaksiDetail.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between pb-3 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <div className="mb-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Penitip: {item.supplier}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatRupiah(item.price)} x {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    {formatRupiah(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg mb-3">Ringkasan Pembayaran</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatRupiah(transaksiDetail.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span>Total Pembayaran:</span>
                <span className="text-2xl text-primary">{formatRupiah(transaksiDetail.total)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg mb-3">Bagi Hasil</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bagian Penitip:</span>
                <span>{formatRupiah(transaksiDetail.supplierTotal)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Keuntungan Toko:</span>
                <span className="text-success">{formatRupiah(transaksiDetail.storeProfit)}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" icon={<Printer className="w-5 h-5" />}>
              Cetak
            </Button>
            <Button variant="outline" icon={<Share2 className="w-5 h-5" />}>
              Bagikan
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
