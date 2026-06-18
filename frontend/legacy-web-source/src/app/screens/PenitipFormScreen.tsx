import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, User, Phone, MapPin, FileText } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function PenitipFormScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [name, setName] = useState(isEdit ? 'Bu Siti' : '');
  const [phone, setPhone] = useState(isEdit ? '081234567890' : '');
  const [address, setAddress] = useState(isEdit ? 'Jl. Merdeka No. 123' : '');
  const [notes, setNotes] = useState(isEdit ? 'Penitip lama, pembayaran tepat waktu' : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/penitip');
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
          <h1 className="text-2xl">{isEdit ? 'Edit Penitip' : 'Tambah Penitip Baru'}</h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Nama lengkap penitip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              label="Nama Penitip"
              required
            />

            <Input
              type="tel"
              placeholder="081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-5 h-5" />}
              label="Nomor HP"
              required
            />

            <div>
              <label className="block text-sm text-foreground mb-2">Alamat</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  rows={3}
                  placeholder="Alamat lengkap penitip"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">Catatan</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  rows={3}
                  placeholder="Catatan tambahan (opsional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button type="submit" fullWidth size="lg">
                {isEdit ? 'Simpan Perubahan' : 'Tambah Penitip'}
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
