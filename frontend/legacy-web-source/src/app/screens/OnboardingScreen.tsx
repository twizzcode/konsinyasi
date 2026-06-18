import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { Button } from '../components/Button';

const onboardingData = [
  {
    icon: <Package className="w-24 h-24" />,
    title: 'Kelola Barang Titipan',
    description: 'Catat semua barang konsinyasi dari penitip dengan mudah.'
  },
  {
    icon: <TrendingUp className="w-24 h-24" />,
    title: 'Pantau Stok & Penjualan',
    description: 'Lihat stok, transaksi, dan status barang secara real-time.'
  },
  {
    icon: <DollarSign className="w-24 h-24" />,
    title: 'Hitung Bagi Hasil Otomatis',
    description: 'Pembagian keuntungan toko dan penitip jadi lebih cepat dan akurat.'
  }
];

export function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <MobileLayout>
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Lewati
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 text-primary p-8 rounded-3xl mb-8">
            {onboardingData[currentPage].icon}
          </div>
          <h2 className="text-2xl mb-4">
            {onboardingData[currentPage].title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-sm">
            {onboardingData[currentPage].description}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center gap-2 mb-6">
            {onboardingData.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentPage
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            fullWidth
            onClick={handleNext}
            icon={currentPage === onboardingData.length - 1 ? null : <ChevronRight className="w-5 h-5" />}
          >
            {currentPage === onboardingData.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
