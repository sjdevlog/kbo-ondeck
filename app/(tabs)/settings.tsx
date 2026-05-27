import { TEAM_COLORS } from '@/constants/teamColors';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TEAMS = Object.keys(TEAM_COLORS);

export default function SettingsScreen() {
  const { favoriteTeam, setFavoriteTeam } = useFavoriteTeam();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>내 팀 설정</Text>
      <Text style={styles.subtitle}>순위표에서 내 팀을 강조 표시합니다</Text>
      <ScrollView contentContainerStyle={styles.list}>
        {TEAMS.map((team) => {
          const selected = favoriteTeam === team;
          const colors = TEAM_COLORS[team];
          return (
            <TouchableOpacity
              key={team}
              style={[
                styles.teamRow,
                selected && { backgroundColor: colors.background, borderColor: colors.primary },
              ]}
              onPress={() => setFavoriteTeam(selected ? null : team)}
              activeOpacity={0.7}
            >
              <View style={styles.teamLeft}>
                <View style={[styles.colorDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.teamName, selected && styles.teamNameSelected]}>{team}</Text>
              </View>
              {selected && (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  teamLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  teamName: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  teamNameSelected: {
    color: '#f8fafc',
    fontWeight: '700',
  },
});
