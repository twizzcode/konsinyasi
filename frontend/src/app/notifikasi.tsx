import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppScreen, BackButton, Card, EmptyState, HeroHeader } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function NotificationScreen() {
  const router = useRouter();
  const { notifications, markAllNotificationsRead } = useApp();
  const iconMap = { stock: 'warning-outline', transaction: 'receipt-outline', system: 'information-circle-outline' } as const;
  const colorMap = { stock: colors.warning, transaction: colors.primary, system: colors.info } as const;
  return (
    <AppScreen contentStyle={styles.page}>
      <HeroHeader title="Notifikasi" subtitle={`${notifications.filter((item) => !item.read).length} belum dibaca`} leftAction={<BackButton onPress={() => router.back()} />} rightAction={<Text style={styles.readAll} onPress={markAllNotificationsRead}>Tandai dibaca</Text>} />
      <View style={styles.content}>
        {notifications.length === 0 ? <EmptyState icon="notifications-off-outline" title="Belum ada notifikasi" /> : notifications.map((item) => (
          <Card key={item.id} style={!item.read && styles.unreadCard}>
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: `${colorMap[item.type]}18` }]}><Ionicons name={iconMap[item.type]} size={24} color={colorMap[item.type]} /></View>
              <View style={styles.flex}><View style={styles.titleRow}><Text style={styles.title}>{item.title}</Text>{!item.read ? <View style={styles.dot} /> : null}</View><Text style={styles.message}>{item.message}</Text><Text style={styles.time}>{item.time}</Text></View>
            </View>
          </Card>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 32 }, readAll: { color: colors.white, fontSize: 12, fontWeight: '700', paddingVertical: spacing.md }, content: { padding: spacing.xxl, gap: spacing.md }, unreadCard: { borderColor: colors.primary, backgroundColor: '#FAFFFD' }, row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }, icon: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' }, flex: { flex: 1 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, title: { color: colors.text, fontWeight: '800', flex: 1 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }, message: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: spacing.xs }, time: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm },
});
