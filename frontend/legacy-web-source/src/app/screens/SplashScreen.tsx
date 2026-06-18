import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Package } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileLayout>
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm">
            <Package className="w-20 h-20" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl mb-2">KonsinyasiKu</h1>
            <p className="text-lg text-primary-foreground/90">
              Kelola Titip Jual Jadi Lebih Mudah
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
