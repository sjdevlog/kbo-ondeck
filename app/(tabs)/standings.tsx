import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── 순위 데이터 ──────────────────────────────────────────────

const STANDINGS = [
  { rank: 1,  name: '삼성 라이온즈', games: 51, win: 31, lose: 19, draw: 1, rate: '0.620', diff: '-',    last10: '7승3패',    streak: '3연승' },
  { rank: 2,  name: 'SSG 랜더스',   games: 51, win: 30, lose: 20, draw: 1, rate: '0.600', diff: '1.0',  last10: '6승4패',    streak: '2연승' },
  { rank: 3,  name: 'KIA 타이거즈',  games: 50, win: 29, lose: 20, draw: 1, rate: '0.592', diff: '1.5',  last10: '4승1무5패', streak: '4연패' },
  { rank: 4,  name: '두산 베어스',   games: 53, win: 30, lose: 21, draw: 2, rate: '0.588', diff: '1.5',  last10: '6승2무2패', streak: '5연승' },
  { rank: 5,  name: '롯데 자이언츠', games: 51, win: 27, lose: 21, draw: 1, rate: '0.563', diff: '3.5',  last10: '6승1무3패', streak: '3연승' },
  { rank: 6,  name: 'NC 다이노스',   games: 50, win: 27, lose: 22, draw: 1, rate: '0.551', diff: '4.0',  last10: '4승1무5패', streak: '2연패' },
  { rank: 7,  name: 'LG 트윈스',    games: 52, win: 27, lose: 23, draw: 2, rate: '0.540', diff: '4.5',  last10: '5승5패',    streak: '2연승' },
  { rank: 8,  name: 'KT 위즈',      games: 51, win: 22, lose: 28, draw: 1, rate: '0.440', diff: '9.5',  last10: '5승5패',    streak: '2연승' },
  { rank: 9,  name: '한화 이글스',   games: 50, win: 20, lose: 29, draw: 1, rate: '0.408', diff: '11.0', last10: '4승1무5패', streak: '1연승' },
  { rank: 10, name: '키움 히어로즈', games: 49, win: 18, lose: 29, draw: 0, rate: '0.383', diff: '12.5', last10: '4승6패',    streak: '1연패' },
];

// ─── 팀 기록 데이터 ───────────────────────────────────────────

const BATTING_STATS: Record<string, { avg: string; ops: string; hr: number; rbi: number; r: number; sb: number; obp: string; slg: string }> = {
  '삼성 라이온즈': { avg: '.281', ops: '.795', hr: 74,  rbi: 248, r: 248, sb: 52, obp: '.360', slg: '.435' },
  'SSG 랜더스':   { avg: '.271', ops: '.775', hr: 71,  rbi: 232, r: 232, sb: 38, obp: '.348', slg: '.427' },
  'KIA 타이거즈':  { avg: '.286', ops: '.802', hr: 67,  rbi: 245, r: 245, sb: 61, obp: '.362', slg: '.440' },
  '두산 베어스':   { avg: '.268', ops: '.762', hr: 62,  rbi: 220, r: 220, sb: 44, obp: '.343', slg: '.419' },
  '롯데 자이언츠': { avg: '.263', ops: '.748', hr: 52,  rbi: 212, r: 212, sb: 57, obp: '.336', slg: '.412' },
  'NC 다이노스':   { avg: '.265', ops: '.751', hr: 55,  rbi: 218, r: 218, sb: 42, obp: '.338', slg: '.413' },
  'LG 트윈스':    { avg: '.272', ops: '.773', hr: 58,  rbi: 228, r: 228, sb: 49, obp: '.349', slg: '.424' },
  'KT 위즈':      { avg: '.258', ops: '.735', hr: 48,  rbi: 205, r: 205, sb: 35, obp: '.330', slg: '.405' },
  '한화 이글스':   { avg: '.270', ops: '.770', hr: 68,  rbi: 235, r: 235, sb: 40, obp: '.345', slg: '.425' },
  '키움 히어로즈': { avg: '.260', ops: '.739', hr: 50,  rbi: 208, r: 208, sb: 66, obp: '.332', slg: '.407' },
};

const PITCHING_STATS: Record<string, { era: string; whip: string; qs: number; sv: number; hld: number; k: number; bb: number }> = {
  '삼성 라이온즈': { era: '3.41', whip: '1.21', qs: 18, sv: 14, hld: 31, k: 412, bb: 158 },
  'SSG 랜더스':   { era: '3.62', whip: '1.25', qs: 16, sv: 12, hld: 28, k: 388, bb: 162 },
  'KIA 타이거즈':  { era: '3.78', whip: '1.28', qs: 14, sv: 13, hld: 26, k: 374, bb: 170 },
  '두산 베어스':   { era: '3.55', whip: '1.23', qs: 17, sv: 11, hld: 29, k: 395, bb: 155 },
  '롯데 자이언츠': { era: '3.90', whip: '1.30', qs: 13, sv: 10, hld: 24, k: 361, bb: 178 },
  'NC 다이노스':   { era: '3.85', whip: '1.29', qs: 14, sv: 9,  hld: 25, k: 368, bb: 172 },
  'LG 트윈스':    { era: '3.70', whip: '1.26', qs: 15, sv: 11, hld: 27, k: 381, bb: 165 },
  'KT 위즈':      { era: '4.21', whip: '1.38', qs: 10, sv: 8,  hld: 20, k: 342, bb: 192 },
  '한화 이글스':   { era: '4.05', whip: '1.33', qs: 12, sv: 10, hld: 22, k: 355, bb: 182 },
  '키움 히어로즈': { era: '4.38', whip: '1.40', qs: 9,  sv: 7,  hld: 18, k: 331, bb: 198 },
};

type StatKey = { batting: keyof typeof BATTING_STATS[string]; pitching: keyof typeof PITCHING_STATS[string] };

const BATTING_COLS:  { label: string; key: keyof typeof BATTING_STATS[string];  width: number }[] = [
  { label: '타율', key: 'avg',  width: 52 },
  { label: '출루율', key: 'obp', width: 56 },
  { label: '장타율', key: 'slg', width: 56 },
  { label: 'OPS',  key: 'ops',  width: 56 },
  { label: '홈런',  key: 'hr',   width: 44 },
  { label: '타점',  key: 'rbi',  width: 44 },
  { label: '득점',  key: 'r',    width: 44 },
  { label: '도루',  key: 'sb',   width: 44 },
];

const PITCHING_COLS: { label: string; key: keyof typeof PITCHING_STATS[string]; width: number }[] = [
  { label: 'ERA',  key: 'era',  width: 52 },
  { label: 'WHIP', key: 'whip', width: 52 },
  { label: 'QS',   key: 'qs',   width: 44 },
  { label: '세이브', key: 'sv',  width: 52 },
  { label: '홀드',  key: 'hld',  width: 44 },
  { label: '탈삼진', key: 'k',   width: 52 },
  { label: '볼넷',  key: 'bb',   width: 44 },
];

// ─── 컴포넌트 ─────────────────────────────────────────────────

type MainTab = '순위' | '팀 기록';
type StatTab = '타격' | '투수';

export default function StandingsScreen() {
  const { favoriteTeam } = useFavoriteTeam();
  const { colors, isDark } = useAppTheme();
  const s = useMemo(() => makeStyles(colors, isDark), [colors, isDark]);

  const [mainTab, setMainTab] = useState<MainTab>('순위');
  const [statTab, setStatTab] = useState<StatTab>('타격');

  // 팀 기록: 선택한 컬럼 기준 정렬
  const [sortKey, setSortKey] = useState<string>('hr');
  const sortedTeams = useMemo(() => {
    const names = STANDINGS.map(t => t.name);
    return [...names].sort((a, b) => {
      const va = statTab === '타격'
        ? (BATTING_STATS[a] as any)[sortKey]
        : (PITCHING_STATS[a] as any)[sortKey];
      const vb = statTab === '타격'
        ? (BATTING_STATS[b] as any)[sortKey]
        : (PITCHING_STATS[b] as any)[sortKey];
      const numA = parseFloat(String(va));
      const numB = parseFloat(String(vb));
      // ERA, WHIP, 볼넷은 낮을수록 좋음
      const ascending = ['era', 'whip', 'bb'].includes(sortKey);
      return ascending ? numA - numB : numB - numA;
    });
  }, [sortKey, statTab]);

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>팀 순위</Text>

      {/* 메인 탭 */}
      <View style={s.tabBar}>
        {(['순위', '팀 기록'] as MainTab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, mainTab === tab && s.tabActive]}
            onPress={() => setMainTab(tab)}
          >
            <Text style={[s.tabText, mainTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mainTab === '순위' ? (
        // ── 순위 테이블 ──────────────────────────────────────
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={s.headerRow}>
              {['순위','팀','경기','승','패','무','승률','GB','최근10G','연속'].map((h, i) => (
                <Text key={h} style={[s.headerCell, { width: [36,110,40,32,32,32,56,44,80,60][i] }]}>{h}</Text>
              ))}
            </View>
            <ScrollView>
              {STANDINGS.map((t, i) => {
                const isFav = favoriteTeam === t.name;
                const tc = TEAM_COLORS[t.name];
                const isWin = t.streak.includes('승');
                const Logo = TEAM_LOGOS[t.name];
                return (
                  <View key={t.name} style={[s.row, i % 2 === 1 && s.rowAlt, isFav && { backgroundColor: isDark ? tc.background : tc.lightBg, borderLeftWidth: 3, borderLeftColor: tc.primary }]}>
                    <Text style={[s.cell, { width: 36 },  isFav && { color: tc.primary, fontWeight: 'bold' }]}>{t.rank}</Text>
                    <View style={[s.nameCell, { width: 110 }]}>
                      <Logo width={24} height={24} />
                      <Text style={[s.nameText, isFav && { color: tc.primary, fontWeight: 'bold' }]} numberOfLines={1}>{t.name}</Text>
                    </View>
                    <Text style={[s.cell, { width: 40 }, isFav && { color: tc.primary }]}>{t.games}</Text>
                    <Text style={[s.cell, s.win,  { width: 32 }]}>{t.win}</Text>
                    <Text style={[s.cell, s.lose, { width: 32 }]}>{t.lose}</Text>
                    <Text style={[s.cell, { width: 32 }, isFav && { color: tc.primary }]}>{t.draw}</Text>
                    <Text style={[s.cell, { width: 56 }, isFav && { color: tc.primary }]}>{t.rate}</Text>
                    <Text style={[s.cell, { width: 44 }, isFav && { color: tc.primary }]}>{t.diff}</Text>
                    <Text style={[s.cell, { width: 80 }, isFav && { color: tc.primary }]}>{t.last10}</Text>
                    <Text style={[s.cell, { width: 60 }, isWin ? s.winStreak : s.loseStreak]}>{t.streak}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        // ── 팀 기록 ──────────────────────────────────────────
        <View style={{ flex: 1 }}>
          {/* 타격/투수 서브 탭 */}
          <View style={s.subTabBar}>
            {(['타격', '투수'] as StatTab[]).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[s.subTab, statTab === tab && s.subTabActive]}
                onPress={() => {
                  setStatTab(tab);
                  setSortKey(tab === '타격' ? 'hr' : 'era');
                }}
              >
                <Text style={[s.subTabText, statTab === tab && s.subTabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* 헤더 */}
              <View style={s.headerRow}>
                <Text style={[s.headerCell, { width: 110 }]}>팀</Text>
                {(statTab === '타격' ? BATTING_COLS : PITCHING_COLS).map(col => (
                  <TouchableOpacity key={col.key} onPress={() => setSortKey(col.key)} style={{ width: col.width }}>
                    <Text style={[s.headerCell, { width: col.width }, sortKey === col.key && s.headerCellActive]}>
                      {col.label}{sortKey === col.key ? ' ↓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 행 */}
              <ScrollView>
                {sortedTeams.map((name, i) => {
                  const isFav = favoriteTeam === name;
                  const tc = TEAM_COLORS[name];
                  const Logo = TEAM_LOGOS[name];
                  const bStats = BATTING_STATS[name];
                  const pStats = PITCHING_STATS[name];
                  const cols = statTab === '타격' ? BATTING_COLS : PITCHING_COLS;
                  return (
                    <View key={name} style={[s.row, i % 2 === 1 && s.rowAlt, isFav && { backgroundColor: isDark ? tc.background : tc.lightBg, borderLeftWidth: 3, borderLeftColor: tc.primary }]}>
                      <View style={[s.nameCell, { width: 110 }]}>
                        <Text style={[s.rankNum, { color: tc.primary }]}>{i + 1}</Text>
                        <Logo width={22} height={22} />
                        <Text style={[s.nameText, isFav && { color: tc.primary, fontWeight: 'bold' }]} numberOfLines={1}>{name}</Text>
                      </View>
                      {cols.map(col => {
                        const val = statTab === '타격' ? (bStats as any)[col.key] : (pStats as any)[col.key];
                        const isSort = sortKey === col.key;
                        return (
                          <Text key={col.key} style={[s.cell, { width: col.width }, isSort && s.sortedCell, isFav && { color: tc.primary }]}>
                            {val}
                          </Text>
                        );
                      })}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors'], isDark: boolean) => StyleSheet.create({
  container:       { flex: 1, backgroundColor: c.bg },
  title:           { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },

  tabBar:          { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, backgroundColor: c.card, borderRadius: 12, padding: 4, gap: 4 },
  tab:             { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  tabActive:       { backgroundColor: c.accent },
  tabText:         { fontSize: 14, fontWeight: '600', color: c.textMuted },
  tabTextActive:   { color: '#fff' },

  subTabBar:       { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, gap: 8 },
  subTab:          { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
  subTabActive:    { backgroundColor: c.accent, borderColor: c.accent },
  subTabText:      { fontSize: 13, fontWeight: '600', color: c.textMuted },
  subTabTextActive:{ color: '#fff' },

  headerRow:       { flexDirection: 'row', backgroundColor: c.tableHeaderBg, paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  headerCell:      { color: c.tableHeaderText, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  headerCellActive:{ color: c.accent, fontWeight: '700' },
  row:             { flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: c.border },
  rowAlt:          { backgroundColor: c.rowAlt },
  cell:            { color: c.textSub, fontSize: 13, textAlign: 'center' },
  sortedCell:      { color: c.text, fontWeight: '700' },
  nameCell:        { flexDirection: 'row', alignItems: 'center', gap: 5 },
  nameText:        { fontSize: 12, color: c.text, flexShrink: 1 },
  rankNum:         { fontSize: 12, fontWeight: 'bold', width: 16, textAlign: 'center' },
  win:             { color: c.win },
  lose:            { color: c.lose },
  winStreak:       { color: c.win, fontWeight: '600' },
  loseStreak:      { color: c.lose, fontWeight: '600' },
});
