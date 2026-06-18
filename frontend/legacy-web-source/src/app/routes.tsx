import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PenitipListScreen } from './screens/PenitipListScreen';
import { PenitipFormScreen } from './screens/PenitipFormScreen';
import { BarangListScreen } from './screens/BarangListScreen';
import { BarangFormScreen } from './screens/BarangFormScreen';
import { BarangDetailScreen } from './screens/BarangDetailScreen';
import { TransaksiListScreen } from './screens/TransaksiListScreen';
import { TransaksiFormScreen } from './screens/TransaksiFormScreen';
import { TransaksiDetailScreen } from './screens/TransaksiDetailScreen';
import { LaporanScreen } from './screens/LaporanScreen';
import { LaporanPenitipScreen } from './screens/LaporanPenitipScreen';
import { NotifikasiScreen } from './screens/NotifikasiScreen';
import { ProfilScreen } from './screens/ProfilScreen';
import { PengaturanAkunScreen } from './screens/PengaturanAkunScreen';
import { KelolaUserScreen } from './screens/KelolaUserScreen';
import { BantuanScreen } from './screens/BantuanScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SplashScreen
  },
  {
    path: '/onboarding',
    Component: OnboardingScreen
  },
  {
    path: '/login',
    Component: LoginScreen
  },
  {
    path: '/register',
    Component: RegisterScreen
  },
  {
    path: '/home',
    Component: HomeScreen
  },
  {
    path: '/penitip',
    Component: PenitipListScreen
  },
  {
    path: '/penitip/tambah',
    Component: PenitipFormScreen
  },
  {
    path: '/penitip/:id',
    Component: PenitipFormScreen
  },
  {
    path: '/barang',
    Component: BarangListScreen
  },
  {
    path: '/barang/tambah',
    Component: BarangFormScreen
  },
  {
    path: '/barang/:id',
    Component: BarangDetailScreen
  },
  {
    path: '/barang/:id/edit',
    Component: BarangFormScreen
  },
  {
    path: '/transaksi',
    Component: TransaksiListScreen
  },
  {
    path: '/transaksi/tambah',
    Component: TransaksiFormScreen
  },
  {
    path: '/transaksi/:id',
    Component: TransaksiDetailScreen
  },
  {
    path: '/laporan',
    Component: LaporanScreen
  },
  {
    path: '/laporan/penitip',
    Component: LaporanPenitipScreen
  },
  {
    path: '/notifikasi',
    Component: NotifikasiScreen
  },
  {
    path: '/profil',
    Component: ProfilScreen
  },
  {
    path: '/profil/pengaturan',
    Component: PengaturanAkunScreen
  },
  {
    path: '/profil/users',
    Component: KelolaUserScreen
  },
  {
    path: '/profil/bantuan',
    Component: BantuanScreen
  }
]);
