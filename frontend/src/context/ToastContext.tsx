import { createContext, type ComponentProps, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';

type ToastTone = 'success' | 'error' | 'info';
type IconName = ComponentProps<typeof Ionicons>['name'];

interface ToastPayload {
  title: string;
  message?: string;
  tone?: ToastTone;
}

interface ToastState extends Required<ToastPayload> {
  id: number;
}

interface ToastContextValue {
  showToast: (payload: ToastPayload) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(({ title, message = '', tone = 'info' }: ToastPayload) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({
      id: Date.now(),
      title,
      message,
      tone,
    });

    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, 2800);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);
  const palette = toast ? {
    success: { bg: '#ECFDF5', border: '#A7F3D0', icon: colors.primaryDark },
    error: { bg: '#FEF2F2', border: '#FECACA', icon: colors.danger },
    info: { bg: '#EFF6FF', border: '#BFDBFE', icon: colors.info },
  }[toast.tone] : null;
  const iconMap = {
    success: 'checkmark-circle-outline',
    error: 'alert-circle-outline',
    info: 'information-circle-outline',
  } as const;
  const icon: IconName = toast ? iconMap[toast.tone] : 'information-circle-outline';

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && palette ? (
        <View pointerEvents="box-none" style={styles.portal}>
          <Pressable onPress={dismissToast} style={[styles.toast, { backgroundColor: palette.bg, borderColor: palette.border }]}>
            <Ionicons name={icon} size={20} color={palette.icon} />
            <View style={styles.body}>
              <Text style={styles.title}>{toast.title}</Text>
              {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
            </View>
          </Pressable>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast harus digunakan di dalam ToastProvider');
  return context;
}

const styles = StyleSheet.create({
  portal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: spacing.xxl,
    zIndex: 1000,
  },
  toast: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 5,
  },
  body: { flex: 1 },
  title: { color: colors.text, fontWeight: '800', fontSize: 14 },
  message: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 2 },
});
