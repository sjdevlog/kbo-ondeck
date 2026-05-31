import { EmptyState } from '@/components/ui/EmptyState';
import { GameCardSkeleton } from '@/components/ui/SkeletonBox';
import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useFavoriteTeam } from '@/context/FavoriteTeamContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useStadiumWeather } from '@/hooks/useStadiumWeather';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Game = {
  away: string;
  home: string;
  time: string;
  stadium: string;
  broadcast: string;
};

// ---------- 날짜 헬퍼 ----------
const KR_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getWeekDates() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return {
      display: `${m}/${day}`,
      iso: d.toISOString().split('T')[0],
      dayName: KR_DAYS[d.getDay()],
      isToday: i === 0,
    };
  });
}

// ---------- 목업데이터 (실제 API 연동 전 임시) ----------
// TODO: replace with real KBO schedule API

const WEEKDAY_GAMES: Game[] = [
  { away: 'KIA 타이거즈',  home: 'LG 트윈스',     time: '18:30', stadium: '잠실',                  broadcast: 'KBS N 스포츠' },
  { away: '두산 베어스',   home: 'SSG 랜더스',    time: '18:30', stadium: '인천SSG랜더스필드',     broadcast: '스포티비' },
  { away: '삼성 라이온즈', home: 'NC 다이노스',   time: '18:30', stadium: '창원NC파크',            broadcast: 'MBC스포츠+' },
  { away: '한화 이글스',  home: '롯데 자이언츠',  time: '18:30', stadium: '사직',                  broadcast: '스포티비2' },
  { away: '키움 히어로즈', home: 'KT 위즈',       time: '18:30', stadium: '수원KT위즈파크',        broadcast: 'TVING' },
];

const WEEKEND_GAMES: Game[] = [
  { away: '두산 베어스',   home: 'KIA 타이거즈',  time: '14:00', stadium: '광주기아챔피언스필드',  broadcast: 'KBS N 스포츠' },
  { away: 'SSG 랜더스',   home: 'LG 트윈스',     time: '14:00', stadium: '잠실',                  broadcast: '스포티비' },
  { away: 'NC 다이노스',  home: '삼성 라이온즈',  time: '14:00', stadium: '대구삼성라이온즈파크',  broadcast: 'MBC스포츠+' },
  { away: '롯데 자이언츠', home: '한화 이글스',   time: '14:00', stadium: '대전한화생명볼파크',    broadcast: '스포티비2' },
  { away: 'KT 위즈',      home: '키움 히어로즈',  time: '14:00', stadium: '고척스카이돔',          broadcast: 'TVING' },
];

function gamesForDow(dow: number): Game[] {
  if (dow === 1) return [];               // 월요일 — 경기 없음
  if (dow === 0 || dow === 6) return WEEKEND_GAMES; // 토·일
  return WEEKDAY_GAMES;                   // 화~금
}

const SCHEDULE: Record<string, Game[]> = Object.fromEntries(
  getWeekDates().map((d) => [d.display, gamesForDow(new Date(d.iso + 'T00:00:00').getDay())])
);

// ---------- 컴포넌트 ----------
export default function GamesScreen() {
  const WEEK = useMemo(() => getWeekDates(), []);
  const [selectedDate, setSelectedDate] = useState(WEEK[0]);
  const [myTeamOnly, setMyTeamOnly] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useAppTheme();
  const { favoriteTeam } = useFavoriteTeam();
  const s = useMemo(() => makeStyles(colors), [colors]);

  const allGames: Game[] = SCHEDULE[selectedDate.display] ?? [];
  const games = myTeamOnly && favoriteTeam
    ? allGames.filter((g) => g.away === favoriteTeam || g.home === favoriteTeam)
    : allGames;

  const stadiums = useMemo(
    () => WEEK.flatMap((d) => (SCHEDULE[d.display] ?? []).map((g) => g.stadium)),
    [WEEK]
  );
  const { getWeather, weatherLoading, weatherError } = useStadiumWeather(stadiums);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>오늘의 경기</Text>
        <TouchableOpacity
          style={[s.filterBtn, myTeamOnly && { backgroundColor: colors.accent }]}
          onPress={() => setMyTeamOnly((v) => !v)}
          disabled={!favoriteTeam}
          activeOpacity={0.7}
        >
          <Ionicons
            name={myTeamOnly ? 'star' : 'star-outline'}
            size={14}
            color={myTeamOnly ? '#fff' : favoriteTeam ? colors.accent : colors.textMuted}
          />
          <Text style={[s.filterText, myTeamOnly && { color: '#fff' }, !favoriteTeam && { color: colors.textMuted }]}>
            내 팀만
          </Text>
        </TouchableOpacity>
      </View>

      {/* 날짜 슬라이더 */}
      <View style={s.dateSliderWrap}>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dateSlider}>
        {WEEK.map((item) => {
          const isSelected = selectedDate.iso === item.iso;
          return (
            <TouchableOpacity
              key={item.iso}
              style={[s.dateItem, isSelected && { backgroundColor: colors.accent }]}
              onPress={() => setSelectedDate(item)}
            >
              <Text style={[s.dayName, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>{item.dayName}</Text>
              <Text style={[s.dateNum, isSelected && { color: '#fff' }]}>{item.display.split('/')[1]}</Text>
              {item.isToday && !isSelected && <View style={s.todayDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>

      {/* 날씨 에러 배너 */}
      {weatherError && !weatherLoading && (
        <View style={[s.errorBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="cloud-offline-outline" size={14} color={colors.textMuted} />
          <Text style={[s.errorText, { color: colors.textMuted }]}>{weatherError}</Text>
        </View>
      )}

      {/* 경기 목록 */}
      <ScrollView contentContainerStyle={s.gameList}>
        {weatherLoading ? (
          // 날씨 로딩 중 → 스켈레톤
          Array.from({ length: 5 }).map((_, i) => <GameCardSkeleton key={i} />)
        ) : games.length === 0 ? (
          myTeamOnly && !favoriteTeam ? (
            <EmptyState
              icon="⭐"
              message="응원 팀을 먼저 선택해주세요"
              sub="'내 팀' 탭에서 응원 팀을 선택하면&#10;해당 팀 경기만 볼 수 있어요"
            />
          ) : myTeamOnly ? (
            <EmptyState
              icon="📅"
              message="오늘은 경기가 없어요"
              sub={`${favoriteTeam}의 경기가 없는 날이에요`}
              actionLabel="전체 경기 보기"
              onAction={() => setMyTeamOnly(false)}
            />
          ) : (
            <EmptyState
              icon="⚾"
              message="오늘은 경기가 없어요"
              sub="휴일이거나 우천 취소된 날이에요"
            />
          )
        ) : (
          games.map((g, i) => {
            const ac = TEAM_COLORS[g.away];
            const hc = TEAM_COLORS[g.home];
            const awayBg = isDark ? ac?.background : ac?.lightBg;
            const homeBg = isDark ? hc?.background : hc?.lightBg;
            const AwayLogo = TEAM_LOGOS[g.away];
            const HomeLogo = TEAM_LOGOS[g.home];
            const weather = getWeather(g.stadium, selectedDate.iso);

            return (
              <View key={i} style={s.gameCard}>
                <View style={s.teamsRow}>
                  <View style={s.teamBlock}>
                    <View style={[s.teamBadge, { backgroundColor: awayBg, borderColor: ac?.primary }]}>
                      <AwayLogo width={38} height={38} />
                    </View>
                    <Text style={s.teamName}>{g.away}</Text>
                  </View>

                  <View style={s.gameCenter}>
                    <Text style={s.gameTime}>{g.time}</Text>
                    <Text style={s.gameStadium}>{g.stadium}</Text>
                    {weather && (
                      <View style={s.weatherRow}>
                        <Text style={s.weatherIcon}>{weather.icon}</Text>
                        <Text style={[s.weatherTemp, { color: colors.textMuted }]}>
                          {weather.tempMin}~{weather.tempMax}°
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={s.teamBlock}>
                    <View style={[s.teamBadge, { backgroundColor: homeBg, borderColor: hc?.primary }]}>
                      <HomeLogo width={38} height={38} />
                    </View>
                    <Text style={s.teamName}>{g.home}</Text>
                  </View>
                </View>

                <View style={s.cardFooter}>
                  <Text style={s.broadcastText}>{g.broadcast}</Text>
                  <TouchableOpacity style={[s.previewBtn, { backgroundColor: colors.accent }]}>
                    <Text style={s.previewText}>프리뷰</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  container:        { flex: 1, backgroundColor: c.bg },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  title:            { fontSize: 20, fontWeight: 'bold', color: c.text },
  filterBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
  filterText:       { fontSize: 13, fontWeight: '600', color: c.accent },
  dateSliderWrap:   { backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.border },
  dateSlider:       { paddingHorizontal: 12, gap: 6, paddingVertical: 10 },
  dateItem:         { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.card, minWidth: 52 },
  dayPill:          {},
  dayName:          { fontSize: 11, color: c.textMuted, marginBottom: 3 },
  dateNum:          { fontSize: 17, fontWeight: 'bold', color: c.text },
  dateTextSelected: { color: '#fff' },
  todayDot:         { width: 4, height: 4, borderRadius: 2, backgroundColor: c.accent, marginTop: 4 },
  todayDotSelected: { backgroundColor: '#fff' },
  errorBanner:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  errorText:        { fontSize: 12 },
  gameList:         { paddingHorizontal: 16, gap: 12, paddingBottom: 24 },
  gameCard:         { backgroundColor: c.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: c.border },
  teamsRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  teamBlock:        { alignItems: 'center', flex: 1 },
  teamBadge:        { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  teamName:         { fontSize: 11, color: c.textMuted, textAlign: 'center' },
  gameCenter:       { alignItems: 'center', flex: 1 },
  gameTime:         { fontSize: 18, fontWeight: 'bold', color: c.text },
  gameStadium:      { fontSize: 11, color: c.textMuted, marginTop: 4, textAlign: 'center' },
  weatherRow:       { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  weatherIcon:      { fontSize: 14 },
  weatherTemp:      { fontSize: 12 },
  cardFooter:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: c.border, paddingTop: 10 },
  broadcastText:    { fontSize: 12, color: c.textMuted },
  previewBtn:       { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  previewText:      { color: '#fff', fontSize: 12, fontWeight: '600' },
});
