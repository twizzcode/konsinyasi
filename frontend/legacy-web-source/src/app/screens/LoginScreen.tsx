import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, ShoppingBag } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <MobileLayout>
      <div className="h-full flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex bg-primary/10 text-primary p-6 rounded-3xl mb-4">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <h1 className="text-3xl mb-2">Selamat Datang</h1>
            <p className="text-muted-foreground">Masuk ke akun KonsinyasiKu Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email atau username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg">
              Masuk
            </Button>
          </form>
        </div>

        <div className="text-center py-4">
          <p className="text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
