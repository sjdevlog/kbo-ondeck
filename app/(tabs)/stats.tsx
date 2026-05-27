import { useAppTheme } from '@/context/ThemeContext';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StatEntry = { name: string; team: string; value: string };
type StatRow   = { label: string; first: StatEntry; second: StatEntry };

const BATTING: StatRow[] = [
  { label: '타율',   first: { name: '김도영',  team: 'KIA', value: '0.362' }, second: { name: '노시환', team: '한화', value: '0.341' } },
  { label: '홈런',   first: { name: '노시환',  team: '한화', value: '18'    }, second: { name: '김도영', team: 'KIA', value: '16'    } },
  { label: '타점',   first: { name: '노시환',  team: '한화', value: '52'    }, second: { name: '김도영', team: 'KIA', value: '48'    } },
  { label: 'WAR',   first: { name: '김도영',  team: 'KIA', value: '4.21'  }, second: { name: '박성한', team: 'SSG', value: '3.87'  } },
  { label: '안타',   first: { name: '김혜성',  team: '키움', value: '68'    }, second: { name: '이정후', team: 'KIA', value: '65'    } },
  { label: '출루율', first: { name: '이정후',  team: 'KIA', value: '0.441' }, second: { name: '김도영', team: 'KIA', value: '0.432' } },
];

const PITCHING: StatRow[] = [
  { label: 'ERA',   first: { name: '양현종', team: 'KIA', value: '2.41'  }, second: { name: '원태인', team: '삼성', value: '2.78'  } },
  { label: '승',    first: { name: '원태인', team: '삼성', value: '11'    }, second: { name: '양현종', team: 'KIA', value: '10'    } },
  { label: '탈삼진', first: { name: '안우진', team: '키움', value: '82'    }, second: { name: '원태인', team: '삼성', value: '76'    } },
  { label: 'WHIP',  first: { name: '양현종', team: 'KIA', value: '0.97'  }, second: { name: '원태인', team: '삼성', value: '1.08'  } },
  { label: 'QS',    first: { name: '원태인', team: '삼성', value: '12'    }, second: { name: '양현종', team: 'KIA', value: '11'    } },
  { label: 'WAR',   first: { name: '원태인', team: '삼성', value: '3.95'  }, second: { name: '양현종', team: 'KIA', value: '3.71'  } },
];

function StatCard({ row, s }: { row: StatRow; s: ReturnType<typeof makeStyles> }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statLabel}>{row.label}</Text>
      <View style={s.statRow}>
        <View style={s.rankBlock}>
          <View style={s.badge1}><Text style={s.badgeNum}>1</Text></View>
          <View>
            <Text style={s.playerName}>{row.first.name}</Text>
            <Text style={s.playerTeam}>{row.first.team}</Text>
          </View>
        </View>
        <Text style={s.statValue}>{row.first.value}</Text>
      </View>
      <View style={[s.statRow, s.statRow2]}>
        <View style={s.rankBlock}>
          <View style={s.badge2}><Text style={s.badgeNum}>2</Text></View>
          <View>
            <Text style={s.playerName}>{row.second.name}</Text>
            <Text style={s.playerTeam}>{row.second.team}</Text>
          </View>
        </View>
        <Text style={s.statValue}>{row.second.value}</Text>
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const [tab, setTab] = useState<'batting' | 'pitching'>('batting');
  const { colors } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const data = tab === 'batting' ? BATTING : PITCHING;

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>선수기록</Text>

      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, tab === 'batting' && { backgroundColor: colors.accent }]} onPress={() => setTab('batting')}>
          <Text style={[s.tabText, tab === 'batting' && s.tabTextActive]}>타격</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === 'pitching' && { backgroundColor: colors.accent }]} onPress={() => setTab('pitching')}>
          <Text style={[s.tabText, tab === 'pitching' && s.tabTextActive]}>투수</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.list}>
        {data.map((row) => (
          <StatCard key={row.label} row={row} s={s} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: c.bg },
  title:        { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingVertical: 14 },
  tabs:         { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, backgroundColor: c.card, borderRadius: 10, padding: 4, borderWidth: 1, borderColor: c.border },
  tab:          { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabText:      { color: c.textMuted, fontSize: 14, fontWeight: '600' },
  tabTextActive:{ color: '#fff' },
  list:         { paddingHorizontal: 16, gap: 10, paddingBottom: 24 },
  statCard:     { backgroundColor: c.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: c.border },
  statLabel:    { color: c.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 10 },
  statRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statRow2:     { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: c.border },
  rankBlock:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge1:       { width: 22, height: 22, borderRadius: 11, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' },
  badge2:       { width: 22, height: 22, borderRadius: 11, backgroundColor: c.textMuted, alignItems: 'center', justifyContent: 'center' },
  badgeNum:     { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  playerName:   { color: c.text, fontSize: 14, fontWeight: '600' },
  playerTeam:   { color: c.textMuted, fontSize: 11, marginTop: 1 },
  statValue:    { color: c.text, fontSize: 18, fontWeight: 'bold' },
});
