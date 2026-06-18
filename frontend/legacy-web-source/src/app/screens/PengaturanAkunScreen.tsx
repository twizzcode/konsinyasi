import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Store, User, Mail, Lock, Camera } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function PengaturanAkunScreen() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('Toko Berkah Jaya');
  const [ownerName, setOwnerName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi@tokoberkah.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profil berhasil diperbarui!');
    navigate(-1);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    alert('Password berhasil diubah!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
          <h1 className="text-2xl">Pengaturan Akun</h1>
        </div>

        <div className="p-6 space-y-6">
          <Card>
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                  <Store className="w-12 h-12" />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Ubah foto profil</p>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg mb-4">Informasi Toko</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                type="text"
                placeholder="Nama toko"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                icon={<Store className="w-5 h-5" />}
                label="Nama Toko"
                required
              />

              <Input
                type="text"
                placeholder="Nama pemilik"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                icon={<User className="w-5 h-5" />}
                label="Nama Pemilik"
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                required
              />

              <Button type="submit" fullWidth>
                Simpan Perubahan
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg mb-4">Ubah Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                type="password"
                placeholder="Password saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                label="Password Saat Ini"
                required
              />

              <Input
                type="password"
                placeholder="Password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                label="Password Baru"
                required
              />

              <Input
                type="password"
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                label="Konfirmasi Password Baru"
                required
              />

              <Button type="submit" fullWidth variant="outline">
                Ubah Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
