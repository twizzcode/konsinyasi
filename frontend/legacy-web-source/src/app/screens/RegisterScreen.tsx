import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Store, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function RegisterScreen() {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    navigate('/home');
  };

  return (
    <MobileLayout>
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl mb-2">Daftar Akun Baru</h1>
            <p className="text-muted-foreground">
              Lengkapi data toko Anda untuk memulai
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder="Nama Toko"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              icon={<Store className="w-5 h-5" />}
              label="Nama Toko"
              required
            />

            <Input
              type="text"
              placeholder="Nama Pemilik"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              label="Nama Pemilik"
              required
            />

            <Input
              type="email"
              placeholder="Email atau username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              label="Email/Username"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              label="Password"
              required
            />

            <Input
              type="password"
              placeholder="Konfirmasi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              label="Konfirmasi Password"
              required
            />

            <Button type="submit" fullWidth size="lg" className="mt-6">
              Daftar Sekarang
            </Button>
          </form>

          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
