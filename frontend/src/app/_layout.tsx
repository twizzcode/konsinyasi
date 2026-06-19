import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    RNStatusBar.setBackgroundColor(colors.primary, true);
    RNStatusBar.setBarStyle('light-content', true);
    RNStatusBar.setTranslucent(false);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <AppProvider>
            <StatusBar style="light" backgroundColor={colors.primary} translucent={false} />
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.primary }} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }} />
          </AppProvider>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
