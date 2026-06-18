import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Package, DollarSign, Users, Hash, Tag, Camera } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function BarangFormScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [name, setName] = useState(isEdit ? 'Minyak Goreng 1L' : '');
  const [supplier, setSupplier] = useState(isEdit ? 'Bu Siti' : '');
  const [price, setPrice] = useState(isEdit ? '15000' : '');
  const [supplierPrice, setSupplierPrice] = useState(isEdit ? '12000' : '');
  const [supplierPercent, setSupplierPercent] = useState(isEdit ? '80' : '');
  const [storePercent, setStorePercent] = useState(isEdit ? '20' : '');
  const [stock, setStock] = useState(isEdit ? '25' : '');
  const [minStock, setMinStock] = useState(isEdit ? '10' : '');
  const [category, setCategory] = useState(isEdit ? 'Kebutuhan Pokok' : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/barang');
  };

  const handleSupplierPercentChange = (value: string) => {
    const percent = parseFloat(value) || 0;
    setSupplierPercent(value);
    setStorePercent((100 - percent).toString());
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
          <h1 className="text-2xl">{isEdit ? 'Edit Barang' : 'Tambah Barang Baru'}</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-2">Foto Barang</label>
              <div className="w-full h-40 bg-muted rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload atau ambil foto</span>
              </div>
            </div>

            <Input
              type="text"
              placeholder="Nama barang"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<Package className="w-5 h-5" />}
              label="Nama Barang"
              required
            />

            <div>
              <label className="block text-sm text-foreground mb-2">Pilih Penitip</label>
              <select
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
              >
                <option value="">Pilih penitip...</option>
                <option value="Bu Siti">Bu Siti</option>
                <option value="Pak Ahmad">Pak Ahmad</option>
                <option value="Bu Yuli">Bu Yuli</option>
                <option value="Pak Budi">Pak Budi</option>
              </select>
            </div>

            <Input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              icon={<DollarSign className="w-5 h-5" />}
              label="Harga Jual (Rp)"
              required
            />

            <Input
              type="number"
              placeholder="0"
              value={supplierPrice}
              onChange={(e) => setSupplierPrice(e.target.value)}
              icon={<DollarSign className="w-5 h-5" />}
              label="Bagian Penitip / Harga Modal (Rp)"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="0"
                value={supplierPercent}
                onChange={(e) => handleSupplierPercentChange(e.target.value)}
                label="Bagian Penitip (%)"
                required
              />
              <Input
                type="number"
                placeholder="0"
                value={storePercent}
                onChange={(e) => setStorePercent(e.target.value)}
                label="Bagian Toko (%)"
                required
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                icon={<Hash className="w-5 h-5" />}
                label="Stok Awal"
                required
              />
              <Input
                type="number"
                placeholder="0"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                icon={<Hash className="w-5 h-5" />}
                label="Minimal Stok"
                required
              />
            </div>

            <Input
              type="text"
              placeholder="Kategori barang"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              icon={<Tag className="w-5 h-5" />}
              label="Kategori"
            />

            <div className="pt-4 space-y-3">
              <Button type="submit" fullWidth size="lg">
                {isEdit ? 'Simpan Perubahan' : 'Tambah Barang'}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
}
