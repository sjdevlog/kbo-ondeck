import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAMS = Object.keys(TEAM_COLORS);

export default function SettingsScreen() {
  const { favoriteTeam, setFavoriteTeam } = useFavoriteTeam();
  const { colors, isDark } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>내 팀 설정</Text>
      <Text style={s.subtitle}>응원 팀을 선택하면 해당 팀 경기를 강조 표시합니다</Text>
      <ScrollView contentContainerStyle={s.grid}>
        {TEAMS.map((team) => {
          const selected = favoriteTeam === team;
          const tc = TEAM_COLORS[team];
          const Logo = TEAM_LOGOS[team];
          const badgeBg = isDark ? tc.background : tc.lightBg;
          return (
            <TouchableOpacity
              key={team}
              style={[s.teamCard, selected && { borderColor: tc.primary, borderWidth: 2 }]}
              onPress={() => setFavoriteTeam(selected ? null : team)}
              activeOpacity={0.7}
            >
              {selected && (
                <View style={[s.checkBadge, { backgroundColor: tc.primary }]}>
                  <Ionicons name="checkmark" size={10} color="#fff" />
                </View>
              )}
              <View style={[s.logoBadge, { backgroundColor: badgeBg, borderColor: tc.primary }]}>
                {Logo && <Logo width={44} height={44} />}
              </View>
              <Text style={[s.teamName, selected && { color: tc.primary, fontWeight: '700' }]} numberOfLines={2}>
                {team}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  title:     { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  subtitle:  { fontSize: 13, color: c.textMuted, paddingHorizontal: 16, paddingBottom: 16 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, paddingBottom: 24 },
  teamCard:  {
    width: '30%',
    alignItems: 'center',
    backgroundColor: c.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: c.border,
    position: 'relative',
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamName:  { fontSize: 11, color: c.textMuted, textAlign: 'center', lineHeight: 15 },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
