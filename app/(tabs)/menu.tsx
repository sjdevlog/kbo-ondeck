import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_ITEMS = [
  { icon: 'notifications-outline' as const, label: '알림 설정',  desc: '경기 시작 알림 설정' },
  { icon: 'information-circle-outline' as const, label: '공지사항', desc: '업데이트 및 공지' },
  { icon: 'help-circle-outline' as const, label: '기록설명',  desc: '야구 스탯 용어 안내' },
  { icon: 'star-outline' as const, label: '앱 평가',   desc: '스토어에서 리뷰 남기기' },
  { icon: 'code-slash-outline' as const, label: '버전 정보', desc: 'v1.0.0' },
];

export default function MenuScreen() {
  const { colors, isDark, toggle } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>메뉴</Text>
      <ScrollView contentContainerStyle={s.list}>

        {/* 다크모드 토글 */}
        <View style={s.toggleRow}>
          <View style={s.toggleLeft}>
            <View style={s.iconWrap}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.accent} />
            </View>
            <View>
              <Text style={s.label}>다크 모드</Text>
              <Text style={s.desc}>{isDark ? '다크 모드 켜짐' : '라이트 모드 켜짐'}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggle}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={s.divider} />

        {MENU_ITEMS.map((item) => (
          <TouchableOpacity key={item.label} style={s.row} activeOpacity={0.7}>
            <View style={s.iconWrap}>
              <Ionicons name={item.icon} size={20} color={colors.textMuted} />
            </View>
            <View style={s.textWrap}>
              <Text style={s.label}>{item.label}</Text>
              <Text style={s.desc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: c.bg },
  title:      { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingVertical: 14 },
  list:       { paddingHorizontal: 16, gap: 8, paddingBottom: 24 },
  toggleRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.card, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: c.border },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  divider:    { height: 1, backgroundColor: c.border, marginVertical: 4 },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: c.card, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: c.border },
  iconWrap:   { width: 36, height: 36, borderRadius: 18, backgroundColor: c.inputBg, alignItems: 'center', justifyContent: 'center' },
  textWrap:   { flex: 1 },
  label:      { color: c.text, fontSize: 15, fontWeight: '500' },
  desc:       { color: c.textMuted, fontSize: 12, marginTop: 2 },
});
