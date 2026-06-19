import { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '@/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function AppScreen({
  children,
  scroll = true,
  contentStyle,
  safeTop = false,
}: {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  safeTop?: boolean;
}) {
  const content = scroll ? (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.screenContent, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenFill, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={safeTop ? ['top', 'left', 'right'] : ['left', 'right']}>
      <KeyboardAvoidingView style={styles.screenFill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function HeroHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
  children,
}: {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.hero}>
      {(leftAction || rightAction) && (
        <View style={styles.headerActions}>
          <View>{leftAction}</View>
          <View>{rightAction}</View>
        </View>
      )}
      <Text style={styles.heroTitle}>{title}</Text>
      {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
      {children ? <View style={styles.heroChildren}>{children}</View> : null}
    </LinearGradient>
  );
}

export function BackButton({ onPress, label = 'Kembali', light = true }: { onPress: () => void; label?: string; light?: boolean }) {
  const color = light ? colors.white : colors.text;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
      <Ionicons name="arrow-back" size={20} color={color} />
      <Text style={[styles.backLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  color = colors.text,
  backgroundColor = 'transparent',
  accessibilityLabel,
  size = 22,
}: {
  icon: IconName;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  accessibilityLabel: string;
  size?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, { backgroundColor }, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
    >
      {children}
    </Pressable>
  );
}

export function AppButton({
  title,
  onPress,
  icon,
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  loading = false,
  style,
}: {
  title: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = {
    primary: { bg: colors.primary, border: colors.primary, text: colors.white },
    secondary: { bg: colors.primarySoft, border: colors.primarySoft, text: colors.primaryDark },
    outline: { bg: colors.surface, border: colors.primary, text: colors.primaryDark },
    danger: { bg: colors.danger, border: colors.danger, text: colors.white },
    text: { bg: 'transparent', border: 'transparent', text: colors.primaryDark },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        { backgroundColor: palette.bg, borderColor: palette.border },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={palette.text} /> : icon ? <Ionicons name={icon} size={20} color={palette.text} /> : null}
      <Text style={[styles.buttonText, { color: palette.text }]}>{title}</Text>
    </Pressable>
  );
}

export function AppInput({
  label,
  error,
  icon,
  multiline,
  containerStyle,
  ...props
}: TextInputProps & {
  label?: string;
  error?: string;
  icon?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.field, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, multiline && styles.multilineWrap, error && styles.inputError]}>
        {icon ? <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.inputIcon} /> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, icon && styles.inputWithIcon, multiline && styles.multilineInput]}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder = 'Cari...' }: { value: string; onChangeText: (value: string) => void; placeholder?: string }) {
  return (
    <View style={styles.searchWrap}>
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Badge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const palette = {
    success: { bg: '#D1FAE5', text: '#047857' },
    warning: { bg: '#FEF3C7', text: '#B45309' },
    danger: { bg: '#FEE2E2', text: '#B91C1C' },
    info: { bg: '#DBEAFE', text: '#1D4ED8' },
    neutral: { bg: '#F3F4F6', text: '#4B5563' },
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.badgeText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}><Text style={styles.sectionAction}>{actionLabel}</Text></Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({ icon, title, description }: { icon: IconName; title: string; description?: string }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons name={icon} size={38} color={colors.textMuted} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyDescription}>{description}</Text> : null}
    </View>
  );
}

export function FloatingActionButton({ icon = 'add', onPress }: { icon?: IconName; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <Ionicons name={icon} size={28} color={colors.white} />
    </Pressable>
  );
}

export interface SelectOption { label: string; value: string; description?: string }

export function SelectField({
  label,
  value,
  options,
  placeholder = 'Pilih...',
  onChange,
}: {
  label?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const selected = options.find((item) => item.value === value);
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.select} onPress={() => setVisible(true)}>
        <Text style={[styles.selectText, !selected && styles.placeholder]}>{selected?.label ?? placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>
      <Modal transparent animationType="slide" visible={visible} onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label ?? 'Pilih opsi'}</Text>
            <ScrollView style={styles.sheetList}>
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.option, active && styles.optionActive]}
                    onPress={() => { onChange(option.value); setVisible(false); }}
                  >
                    <View style={styles.optionTextWrap}>
                      <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{option.label}</Text>
                      {option.description ? <Text style={styles.optionDescription}>{option.description}</Text> : null}
                    </View>
                    {active ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function StatCard({ icon, label, value, tone = 'primary' }: { icon: IconName; label: string; value: string; tone?: 'primary' | 'warning' | 'info' | 'danger' }) {
  const color = { primary: colors.primary, warning: colors.warning, info: colors.info, danger: colors.danger }[tone];
  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}><Ionicons name={icon} size={22} color={color} /></View>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

export function Divider() { return <View style={styles.divider} />; }

export const typography = StyleSheet.create({
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700', color: colors.text },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700', color: colors.text },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  muted: { fontSize: 14, lineHeight: 20, color: colors.textMuted },
  caption: { fontSize: 12, lineHeight: 17, color: colors.textMuted },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screenFill: { flex: 1 },
  screenContent: { flexGrow: 1, paddingBottom: 28 },
  hero: { paddingHorizontal: spacing.xxl, paddingTop: spacing.lg, paddingBottom: spacing.xxl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  headerActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, minHeight: 40 },
  heroTitle: { color: colors.white, fontSize: 26, lineHeight: 32, fontWeight: '700' },
  heroSubtitle: { color: 'rgba(255,255,255,0.86)', marginTop: spacing.xs, fontSize: 14, lineHeight: 20 },
  heroChildren: { marginTop: spacing.lg },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingRight: spacing.md },
  backLabel: { fontSize: 15, fontWeight: '600' },
  iconButton: { width: 42, height: 42, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, shadowColor: colors.black, shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  cardPressed: { opacity: 0.82, transform: [{ scale: 0.995 }] },
  button: { minHeight: 48, paddingHorizontal: spacing.lg, borderRadius: radius.md, borderWidth: 1.5, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  fullWidth: { width: '100%' },
  buttonText: { fontSize: 15, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.72 },
  field: { width: '100%', gap: spacing.sm },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  inputWrap: { minHeight: 50, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.input, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center' },
  multilineWrap: { minHeight: 104, alignItems: 'flex-start' },
  inputIcon: { marginLeft: spacing.md },
  input: { flex: 1, color: colors.text, paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 15 },
  inputWithIcon: { paddingLeft: spacing.sm },
  multilineInput: { minHeight: 104, paddingTop: 14 },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 12 },
  searchWrap: { minHeight: 48, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 10 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  badgeText: { fontSize: 12, fontWeight: '700' },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', flex: 1 },
  sectionAction: { color: colors.primaryDark, fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: spacing.xxl },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  emptyDescription: { color: colors.textMuted, fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: spacing.sm },
  fab: { position: 'absolute', right: 22, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primaryDark, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 8 },
  select: { minHeight: 50, backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectText: { color: colors.text, fontSize: 15, flex: 1 },
  placeholder: { color: colors.textMuted },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: { maxHeight: '72%', backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: spacing.xxl, paddingTop: spacing.sm, paddingBottom: 30 },
  sheetHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.lg },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  sheetList: { flexGrow: 0 },
  option: { minHeight: 58, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  optionActive: { backgroundColor: colors.primarySoft, marginHorizontal: -spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.md, borderBottomWidth: 0 },
  optionTextWrap: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  optionLabelActive: { color: colors.primaryDark },
  optionDescription: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  statCard: { flex: 1, minWidth: '46%', gap: spacing.sm },
  statIcon: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  statValue: { color: colors.text, fontSize: 21, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: '100%' },
});
