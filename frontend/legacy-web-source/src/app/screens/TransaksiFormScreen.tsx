import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Minus, Trash2, Package } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  supplier: string;
  supplierShare: number;
  storeShare: number;
}

const availableProducts = [
  { id: '1', name: 'Minyak Goreng 1L', price: 15000, supplier: 'Bu Siti', supplierShare: 0.8, storeShare: 0.2 },
  { id: '2', name: 'Gula Pasir 1kg', price: 18000, supplier: 'Pak Ahmad', supplierShare: 0.8, storeShare: 0.2 },
  { id: '3', name: 'Mie Instan', price: 3500, supplier: 'Bu Yuli', supplierShare: 0.8, storeShare: 0.2 },
  { id: '4', name: 'Tepung Terigu', price: 12000, supplier: 'Bu Siti', supplierShare: 0.8, storeShare: 0.2 }
];

export function TransaksiFormScreen() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductList, setShowProductList] = useState(false);

  const addToCart = (product: typeof availableProducts[0]) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowProductList(false);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const supplierTotal = cart.reduce((sum, item) =>
    sum + (item.price * item.quantity * item.supplierShare), 0
  );
  const storeProfit = cart.reduce((sum, item) =>
    sum + (item.price * item.quantity * item.storeShare), 0
  );

  const handleSave = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }
    navigate('/transaksi');
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto flex flex-col">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 pb-8 rounded-b-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <h1 className="text-2xl">Transaksi Baru</h1>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <Button
            variant="outline"
            fullWidth
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowProductList(!showProductList)}
          >
            Pilih Barang
          </Button>

          {showProductList && (
            <Card className="max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-between p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <div>{product.name}</div>
                      <div className="text-sm text-muted-foreground">{formatRupiah(product.price)}</div>
                    </div>
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div>
            <h3 className="text-lg mb-3">Keranjang ({cart.length})</h3>
            {cart.length === 0 ? (
              <Card className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <div className="text-muted-foreground">Belum ada barang</div>
              </Card>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="mb-1">{item.name}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {formatRupiah(item.price)} x {item.quantity} = {formatRupiah(item.price * item.quantity)}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="w-12 text-center">{item.quantity}</div>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-card border-t border-border space-y-4">
          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bagian Penitip:</span>
                <span>{formatRupiah(supplierTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Keuntungan Toko:</span>
                <span className="text-success">{formatRupiah(storeProfit)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span>Total Pembayaran:</span>
                <span className="text-2xl text-primary">{formatRupiah(total)}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              Simpan Transaksi
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
