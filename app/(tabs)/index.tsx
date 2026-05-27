import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAMS = Object.keys(TEAM_COLORS);

export default function MyTeamScreen() {
  const { favoriteTeam, setFavoriteTeam } = useFavoriteTeam();
  const { colors } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>내 팀</Text>
      <Text style={s.subtitle}>응원하는 팀을 선택하세요</Text>
      <ScrollView contentContainerStyle={s.list}>
        {TEAMS.map((team) => {
          const selected = favoriteTeam === team;
          const tc = TEAM_COLORS[team];
          const Logo = TEAM_LOGOS[team];
          return (
            <TouchableOpacity
              key={team}
              style={[s.teamRow, selected && { borderColor: tc.primary, backgroundColor: tc.lightBg }]}
              onPress={() => setFavoriteTeam(selected ? null : team)}
              activeOpacity={0.7}
            >
              <View style={s.teamLeft}>
                <Logo width={32} height={32} />
                <Text style={[s.teamName, selected && { color: tc.primary, fontWeight: '700' }]}>{team}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={22} color={tc.primary} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: c.bg },
  title:      { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  subtitle:   { fontSize: 13, color: c.textMuted, paddingHorizontal: 16, paddingBottom: 16 },
  list:       { paddingHorizontal: 16, gap: 8, paddingBottom: 24 },
  teamRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.card, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 18, borderWidth: 1.5, borderColor: c.border },
  teamLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teamName:   { fontSize: 16, color: c.textSub, fontWeight: '500' },
});
