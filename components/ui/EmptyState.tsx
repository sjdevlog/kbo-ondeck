import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  icon?: string;
  message: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = '📭', message, sub, actionLabel, onAction }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={s.wrap}>
      <Text style={s.icon}>{icon}</Text>
      <Text style={[s.message, { color: colors.text }]}>{message}</Text>
      {sub && <Text style={[s.sub, { color: colors.textMuted }]}>{sub}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={[s.btn, { backgroundColor: colors.accent }]} onPress={onAction}>
          <Text style={s.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { alignItems: 'center', paddingTop: 64, paddingHorizontal: 32 },
  icon:    { fontSize: 40, marginBottom: 12 },
  message: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 6 },
  sub:     { fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 19 },
  btn:     { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
