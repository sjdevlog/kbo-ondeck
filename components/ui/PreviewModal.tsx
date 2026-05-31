import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Game } from '@/types/game';

// ─── Mock 데이터 ──────────────────────────────────────────────

type Pitcher = { name: string; hand: 'L' | 'R'; era: number; wins: number; losses: number };
type BattingStats = { avg: string; ops: string; runs: number; hr: number };

const PITCHERS: Record<string, Pitcher> = {
  'KIA 타이거즈':  { name: '양현종',    hand: 'L', era: 3.24, wins: 8,  losses: 3 },
  'LG 트윈스':    { name: '임찬규',    hand: 'L', era: 3.87, wins: 6,  losses: 4 },
  '두산 베어스':   { name: '곽빈',     hand: 'R', era: 3.52, wins: 7,  losses: 3 },
  'SSG 랜더스':   { name: '김광현',   hand: 'L', era: 2.98, wins: 9,  losses: 2 },
  'NC 다이노스':  { name: '루친스키', hand: 'R', era: 3.76, wins: 6,  losses: 5 },
  'KT 위즈':      { name: '웨스',     hand: 'R', era: 4.12, wins: 5,  losses: 6 },
  '롯데 자이언츠': { name: '박세웅',   hand: 'R', era: 3.45, wins: 7,  losses: 4 },
  '삼성 라이온즈': { name: '원태인',   hand: 'R', era: 2.87, wins: 10, losses: 2 },
  '한화 이글스':   { name: '문동주',   hand: 'R', era: 3.68, wins: 7,  losses: 4 },
  '키움 히어로즈': { name: '하영민',   hand: 'R', era: 4.23, wins: 5,  losses: 6 },
};

const BATTING: Record<string, BattingStats> = {
  'KIA 타이거즈':  { avg: '.286', ops: '.802', runs: 245, hr: 67 },
  'LG 트윈스':    { avg: '.272', ops: '.773', runs: 228, hr: 58 },
  '두산 베어스':   { avg: '.268', ops: '.762', runs: 220, hr: 62 },
  'SSG 랜더스':   { avg: '.271', ops: '.775', runs: 232, hr: 71 },
  'NC 다이노스':  { avg: '.265', ops: '.751', runs: 218, hr: 55 },
  'KT 위즈':      { avg: '.258', ops: '.735', runs: 205, hr: 48 },
  '롯데 자이언츠': { avg: '.263', ops: '.748', runs: 212, hr: 52 },
  '삼성 라이온즈': { avg: '.281', ops: '.795', runs: 248, hr: 74 },
  '한화 이글스':   { avg: '.270', ops: '.770', runs: 235, hr: 68 },
  '키움 히어로즈': { avg: '.260', ops: '.739', runs: 208, hr: 50 },
};

function mockH2H(away: string, home: string) {
  const seed = away.charCodeAt(0) + home.charCodeAt(0);
  const DATES = ['5/18', '5/11', '4/28', '4/21', '3/14'];
  return DATES.map((date, i) => {
    const awayScore = (seed + i * 3) % 7;
    const homeScore = (seed + i * 2 + 1) % 7;
    return { date, awayScore, homeScore, awayWin: awayScore > homeScore };
  });
}

// ─── 컴포넌트 ─────────────────────────────────────────────────

type Weather = { icon: string; tempMin: number; tempMax: number } | null;

type Props = {
  game: Game | null;
  weather: Weather;
  onClose: () => void;
};

export default function PreviewModal({ game, weather, onClose }: Props) {
  const { colors, isDark } = useAppTheme();
  const s = React.useMemo(() => makeStyles(colors, isDark), [colors, isDark]);

  if (!game) return null;

  const AwayLogo = TEAM_LOGOS[game.away];
  const HomeLogo = TEAM_LOGOS[game.home];
  const ac = TEAM_COLORS[game.away];
  const hc = TEAM_COLORS[game.home];
  const awayP = PITCHERS[game.away];
  const homeP = PITCHERS[game.home];
  const awayB = BATTING[game.away];
  const homeB = BATTING[game.home];
  const h2h = mockH2H(game.away, game.home);
  const awayWins = h2h.filter(g => g.awayWin).length;
  const homeWins = h2h.length - awayWins;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />

          {/* 헤더 */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>경기 프리뷰</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

            {/* 팀 헤더 */}
            <View style={s.teamsRow}>
              <View style={s.teamCol}>
                <View style={[s.logoBadge, { backgroundColor: isDark ? ac?.background : ac?.lightBg, borderColor: ac?.primary }]}>
                  {AwayLogo && <AwayLogo width={48} height={48} />}
                </View>
                <Text style={s.teamName}>{game.away}</Text>
                <Text style={[s.teamTag, { color: ac?.primary }]}>원정</Text>
              </View>
              <View style={s.vsCol}>
                <Text style={s.vs}>VS</Text>
                <Text style={s.gameTime}>{game.time}</Text>
                <Text style={s.stadium}>{game.stadium}</Text>
              </View>
              <View style={s.teamCol}>
                <View style={[s.logoBadge, { backgroundColor: isDark ? hc?.background : hc?.lightBg, borderColor: hc?.primary }]}>
                  {HomeLogo && <HomeLogo width={48} height={48} />}
                </View>
                <Text style={s.teamName}>{game.home}</Text>
                <Text style={[s.teamTag, { color: hc?.primary }]}>홈</Text>
              </View>
            </View>

            {/* 구장 날씨 */}
            {weather && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>🌤 구장 날씨</Text>
                <View style={s.weatherBox}>
                  <Text style={s.weatherBigIcon}>{weather.icon}</Text>
                  <Text style={s.weatherTemp}>{weather.tempMin}° ~ {weather.tempMax}°</Text>
                </View>
              </View>
            )}

            {/* 선발 투수 */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>⚾ 선발 투수</Text>
              <View style={s.pitcherRow}>
                <View style={s.pitcherCol}>
                  <Text style={s.pitcherName}>{awayP?.name ?? 'TBD'}</Text>
                  {awayP && (
                    <>
                      <View style={s.handBadge}>
                        <Text style={s.handText}>{awayP.hand === 'L' ? '좌투' : '우투'}</Text>
                      </View>
                      <Text style={s.pitcherStat}>ERA {awayP.era.toFixed(2)}</Text>
                      <Text style={s.pitcherStat}>{awayP.wins}승 {awayP.losses}패</Text>
                    </>
                  )}
                </View>
                <View style={s.pitcherDivider} />
                <View style={[s.pitcherCol, { alignItems: 'flex-end' }]}>
                  <Text style={s.pitcherName}>{homeP?.name ?? 'TBD'}</Text>
                  {homeP && (
                    <>
                      <View style={s.handBadge}>
                        <Text style={s.handText}>{homeP.hand === 'L' ? '좌투' : '우투'}</Text>
                      </View>
                      <Text style={s.pitcherStat}>ERA {homeP.era.toFixed(2)}</Text>
                      <Text style={s.pitcherStat}>{homeP.wins}승 {homeP.losses}패</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* 최근 상대전적 */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>📊 최근 상대전적</Text>
              <View style={s.h2hSummary}>
                <Text style={[s.h2hWins, { color: ac?.primary }]}>{awayWins}승</Text>
                <Text style={s.h2hMid}> 최근 5경기 </Text>
                <Text style={[s.h2hWins, { color: hc?.primary }]}>{homeWins}승</Text>
              </View>
              {h2h.map((r, i) => (
                <View key={i} style={s.h2hRow}>
                  <Text style={s.h2hDate}>{r.date}</Text>
                  <Text style={[s.h2hScore, r.awayWin && s.boldScore]}>{r.awayScore}</Text>
                  <Text style={s.h2hVs}> : </Text>
                  <Text style={[s.h2hScore, !r.awayWin && s.boldScore]}>{r.homeScore}</Text>
                  <Text style={[s.h2hWinner, { color: r.awayWin ? ac?.primary : hc?.primary }]}>
                    {(r.awayWin ? game.away : game.home).split(' ')[0]} 승
                  </Text>
                </View>
              ))}
            </View>

            {/* 팀 타선 */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>🏏 팀 타선</Text>
              <View style={s.table}>
                <View style={[s.tableRow, s.tableHeader]}>
                  <Text style={[s.tableCell, s.tableLabelCell]} />
                  <Text style={[s.tableCell, s.tableHeadCell]}>타율</Text>
                  <Text style={[s.tableCell, s.tableHeadCell]}>OPS</Text>
                  <Text style={[s.tableCell, s.tableHeadCell]}>득점</Text>
                  <Text style={[s.tableCell, s.tableHeadCell]}>홈런</Text>
                </View>
                <View style={s.tableRow}>
                  <Text style={[s.tableCell, s.tableLabelCell, { color: ac?.primary }]}>
                    {game.away.split(' ')[0]}
                  </Text>
                  <Text style={s.tableCell}>{awayB?.avg}</Text>
                  <Text style={s.tableCell}>{awayB?.ops}</Text>
                  <Text style={s.tableCell}>{awayB?.runs}</Text>
                  <Text style={s.tableCell}>{awayB?.hr}</Text>
                </View>
                <View style={[s.tableRow, s.tableRowAlt]}>
                  <Text style={[s.tableCell, s.tableLabelCell, { color: hc?.primary }]}>
                    {game.home.split(' ')[0]}
                  </Text>
                  <Text style={s.tableCell}>{homeB?.avg}</Text>
                  <Text style={s.tableCell}>{homeB?.ops}</Text>
                  <Text style={s.tableCell}>{homeB?.runs}</Text>
                  <Text style={s.tableCell}>{homeB?.hr}</Text>
                </View>
              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    sheet:      { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
    handle:     { width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginTop: 12 },
    header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle:{ fontSize: 16, fontWeight: 'bold', color: c.text },
    closeBtn:   { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    content:    { paddingHorizontal: 20, paddingBottom: 40 },

    teamsRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: c.border },
    teamCol:    { flex: 1, alignItems: 'center', gap: 6 },
    logoBadge:  { width: 68, height: 68, borderRadius: 34, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    teamName:   { fontSize: 11, color: c.text, fontWeight: '600', textAlign: 'center' },
    teamTag:    { fontSize: 11, fontWeight: '700' },
    vsCol:      { alignItems: 'center', gap: 4, paddingHorizontal: 8 },
    vs:         { fontSize: 18, fontWeight: 'bold', color: c.textMuted },
    gameTime:   { fontSize: 14, fontWeight: '700', color: c.text },
    stadium:    { fontSize: 11, color: c.textMuted, textAlign: 'center' },

    section:      { marginBottom: 24 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: c.text, marginBottom: 12 },

    weatherBox:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.bg, borderRadius: 12, padding: 14 },
    weatherBigIcon: { fontSize: 32 },
    weatherTemp:    { fontSize: 18, fontWeight: '600', color: c.text },

    pitcherRow:     { flexDirection: 'row' },
    pitcherCol:     { flex: 1, gap: 6 },
    pitcherDivider: { width: 1, backgroundColor: c.border, marginHorizontal: 16 },
    pitcherName:    { fontSize: 18, fontWeight: 'bold', color: c.text },
    handBadge:      { backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
    handText:       { fontSize: 12, color: c.textMuted, fontWeight: '600' },
    pitcherStat:    { fontSize: 13, color: c.textMuted },

    h2hSummary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    h2hWins:    { fontSize: 20, fontWeight: 'bold' },
    h2hMid:     { fontSize: 13, color: c.textMuted },
    h2hRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: c.border },
    h2hDate:    { width: 44, fontSize: 12, color: c.textMuted },
    h2hScore:   { fontSize: 14, color: c.textMuted, width: 20, textAlign: 'center' },
    h2hVs:      { fontSize: 13, color: c.textMuted },
    boldScore:  { fontWeight: 'bold', color: '#111' },
    h2hWinner:  { flex: 1, fontSize: 12, textAlign: 'right', fontWeight: '600' },

    table:         { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: c.border },
    tableRow:      { flexDirection: 'row', paddingVertical: 10, backgroundColor: c.card },
    tableRowAlt:   { backgroundColor: isDark ? '#1a1f2e' : '#f8fafc' },
    tableHeader:   { backgroundColor: isDark ? '#0f1320' : '#f1f5f9', paddingVertical: 7 },
    tableCell:     { flex: 1, fontSize: 13, color: c.text, textAlign: 'center' },
    tableLabelCell:{ flex: 1.3, fontWeight: '700', paddingLeft: 10, textAlign: 'left' },
    tableHeadCell: { color: c.textMuted, fontSize: 12 },
  });
