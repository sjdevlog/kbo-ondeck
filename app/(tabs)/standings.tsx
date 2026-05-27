import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const teams = [
  { rank: 1,  name: '삼성 라이온즈', games: 51, win: 31, lose: 19, draw: 1, rate: '0.620', diff: '-',    last10: '7승3패',   streak: '3연승' },
  { rank: 2,  name: 'SSG 랜더스',   games: 51, win: 30, lose: 20, draw: 1, rate: '0.600', diff: '1.0',  last10: '6승4패',   streak: '2연승' },
  { rank: 3,  name: 'KIA 타이거즈',  games: 50, win: 29, lose: 20, draw: 1, rate: '0.592', diff: '1.5',  last10: '4승1무5패', streak: '4연패' },
  { rank: 4,  name: '두산 베어스',   games: 53, win: 30, lose: 21, draw: 2, rate: '0.588', diff: '1.5',  last10: '6승2무2패', streak: '5연승' },
  { rank: 5,  name: '롯데 자이언츠', games: 51, win: 27, lose: 21, draw: 1, rate: '0.563', diff: '3.5',  last10: '6승1무3패', streak: '3연승' },
  { rank: 6,  name: 'NC 다이노스',   games: 50, win: 27, lose: 22, draw: 1, rate: '0.551', diff: '4.0',  last10: '4승1무5패', streak: '2연패' },
  { rank: 7,  name: 'LG 트윈스',    games: 52, win: 27, lose: 23, draw: 2, rate: '0.540', diff: '4.5',  last10: '5승5패',   streak: '2연승' },
  { rank: 8,  name: 'KT 위즈',      games: 51, win: 22, lose: 28, draw: 1, rate: '0.440', diff: '9.5',  last10: '5승5패',   streak: '2연승' },
  { rank: 9,  name: '한화 이글스',   games: 50, win: 20, lose: 29, draw: 1, rate: '0.408', diff: '11.0', last10: '4승1무5패', streak: '1연승' },
  { rank: 10, name: '키움 히어로즈', games: 49, win: 18, lose: 29, draw: 0, rate: '0.383', diff: '12.5', last10: '4승6패',   streak: '1연패' },
];

const COLS   = ['순위', '팀', '경기', '승', '패', '무', '승률', 'GB', '최근10G', '연속'];
const WIDTHS = [36, 110, 40, 32, 32, 32, 56, 44, 80, 60];

export default function StandingsScreen() {
  const { favoriteTeam } = useFavoriteTeam();
  const { colors, isDark } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>팀 순위</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={s.headerRow}>
            {COLS.map((h, i) => (
              <Text key={h} style={[s.headerCell, { width: WIDTHS[i] }]}>{h}</Text>
            ))}
          </View>
          <ScrollView>
            {teams.map((t, i) => {
              const isFav = favoriteTeam === t.name;
              const tc = TEAM_COLORS[t.name];
              const isWin = t.streak.includes('승');
              const favBg = isDark ? tc.background : tc.lightBg;
              const Logo = TEAM_LOGOS[t.name];
              return (
                <View
                  key={t.name}
                  style={[
                    s.row,
                    i % 2 === 1 && s.rowAlt,
                    isFav && { backgroundColor: favBg, borderLeftWidth: 3, borderLeftColor: tc.primary },
                  ]}
                >
                  <Text style={[s.cell, { width: WIDTHS[0] }, isFav && { color: tc.primary, fontWeight: 'bold' }]}>{t.rank}</Text>
                  <View style={[s.nameCell, { width: WIDTHS[1] }]}>
                    <Logo width={24} height={24} />
                    <Text style={[s.nameText, isFav && { color: tc.primary, fontWeight: 'bold' }]} numberOfLines={1}>{t.name}</Text>
                  </View>
                  <Text style={[s.cell, { width: WIDTHS[2] }, isFav && { color: tc.primary }]}>{t.games}</Text>
                  <Text style={[s.cell, s.win, { width: WIDTHS[3] }]}>{t.win}</Text>
                  <Text style={[s.cell, s.lose, { width: WIDTHS[4] }]}>{t.lose}</Text>
                  <Text style={[s.cell, { width: WIDTHS[5] }, isFav && { color: tc.primary }]}>{t.draw}</Text>
                  <Text style={[s.cell, { width: WIDTHS[6] }, isFav && { color: tc.primary }]}>{t.rate}</Text>
                  <Text style={[s.cell, { width: WIDTHS[7] }, isFav && { color: tc.primary }]}>{t.diff}</Text>
                  <Text style={[s.cell, { width: WIDTHS[8] }, isFav && { color: tc.primary }]}>{t.last10}</Text>
                  <Text style={[s.cell, { width: WIDTHS[9] }, isWin ? s.winStreak : s.loseStreak]}>{t.streak}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: c.bg },
  title:        { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingVertical: 14 },
  headerRow:    { flexDirection: 'row', backgroundColor: c.tableHeaderBg, paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  headerCell:   { color: c.tableHeaderText, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  row:          { flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  rowAlt:       { backgroundColor: c.rowAlt },
  cell:         { color: c.textSub, fontSize: 13, textAlign: 'center' },
  nameCell:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nameText:     { fontSize: 13, color: c.text, flexShrink: 1 },
  win:          { color: c.win },
  lose:         { color: c.lose },
  winStreak:    { color: c.win, fontWeight: '600' },
  loseStreak:   { color: c.lose, fontWeight: '600' },
});
