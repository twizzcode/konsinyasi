import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import type { AuthUserProfile } from '@/types/auth';

const icon = (name: React.ComponentProps<typeof Ionicons>['name']) => ({ color, size }: { color: ColorValue; size: number }) => (
  <Ionicons name={name} color={color} size={size} />
);

export default function TabsLayout() {
  const { loading, ready, session, user } = useAuth();
  const profile = (user ?? {}) as AuthUserProfile;
  const isStore = profile.accountType === 'store';
  const isSupplier = profile.accountType === 'supplier';

  if (!loading && ready && !session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { height: 68, paddingTop: 7, paddingBottom: 9, borderTopColor: colors.border, backgroundColor: colors.surface },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      {(isStore || isSupplier) ? <Tabs.Screen name="supplier" options={{ title: isStore ? 'Supplier' : 'Toko', tabBarIcon: icon('people-outline') }} /> : null}
      <Tabs.Screen
        name="barang"
        options={isStore
          ? { title: 'Barang', tabBarIcon: icon('cube-outline') }
          : { href: null }}
      />
      <Tabs.Screen
        name="transaksi"
        options={isStore
          ? { title: 'Transaksi', tabBarIcon: icon('receipt-outline') }
          : { href: null }}
      />
      <Tabs.Screen
        name="laporan"
        options={isStore
          ? { title: 'Laporan', tabBarIcon: icon('bar-chart-outline') }
          : { href: null }}
      />
      <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}
