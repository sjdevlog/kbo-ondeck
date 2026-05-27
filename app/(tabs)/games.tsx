import { TEAM_COLORS } from '@/constants/teamColors';
import { TEAM_LOGOS } from '@/constants/teamLogos';
import { useAppTheme } from '@/context/ThemeContext';
import { useRef, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Game = { away: string; home: string; time: string; stadium: string; broadcast: string };

const SCHEDULE: Record<string, Game[]> = {
  '5/17': [
    { away: 'KIA 타이거즈',  home: 'LG 트윈스',    time: '14:00', stadium: '잠실',              broadcast: 'KBS N 스포츠' },
    { away: '두산 베어스',   home: 'SSG 랜더스',   time: '14:00', stadium: '인천SSG랜더스필드',   broadcast: '스포티비' },
    { away: '삼성 라이온즈', home: 'NC 다이노스',   time: '14:00', stadium: '창원NC파크',          broadcast: 'MBC스포츠+' },
    { away: '한화 이글스',   home: '롯데 자이언츠', time: '14:00', stadium: '사직',               broadcast: '스포티비2' },
    { away: '키움 히어로즈', home: 'KT 위즈',      time: '14:00', stadium: '수원KT위즈파크',      broadcast: 'TVING' },
  ],
  '5/18': [
    { away: 'LG 트윈스',    home: 'KIA 타이거즈',  time: '14:00', stadium: '광주기아챔피언스필드', broadcast: 'KBS N 스포츠' },
    { away: 'SSG 랜더스',   home: '두산 베어스',   time: '14:00', stadium: '잠실',               broadcast: '스포티비' },
    { away: 'NC 다이노스',  home: '삼성 라이온즈', time: '14:00', stadium: '대구삼성라이온즈파크', broadcast: 'MBC스포츠+' },
  ],
  '5/19': [],
  '5/20': [
    { away: 'KIA 타이거즈',  home: 'LG 트윈스',    time: '18:30', stadium: '잠실',              broadcast: 'KBS N 스포츠' },
    { away: '두산 베어스',   home: 'SSG 랜더스',   time: '18:30', stadium: '인천SSG랜더스필드',   broadcast: '스포티비' },
    { away: '삼성 라이온즈', home: 'NC 다이노스',   time: '18:30', stadium: '창원NC파크',          broadcast: 'MBC스포츠+' },
    { away: '한화 이글스',   home: '롯데 자이언츠', time: '18:30', stadium: '사직',               broadcast: '스포티비2' },
    { away: '키움 히어로즈', home: 'KT 위즈',      time: '18:30', stadium: '수원KT위즈파크',      broadcast: 'TVING' },
  ],
  '5/21': [
    { away: 'LG 트윈스',    home: 'KIA 타이거즈',  time: '18:30', stadium: '광주기아챔피언스필드', broadcast: 'KBS N 스포츠' },
    { away: 'SSG 랜더스',   home: '두산 베어스',   time: '18:30', stadium: '잠실',               broadcast: '스포티비' },
    { away: 'NC 다이노스',  home: '삼성 라이온즈', time: '18:30', stadium: '대구삼성라이온즈파크', broadcast: 'MBC스포츠+' },
    { away: '롯데 자이언츠', home: '한화 이글스',   time: '18:30', stadium: '대전한화생명볼파크',  broadcast: '스포티비2' },
    { away: 'KT 위즈',      home: '키움 히어로즈', time: '18:30', stadium: '고척스카이돔',        broadcast: 'TVING' },
  ],
  '5/22': [
    { away: 'KIA 타이거즈',  home: '두산 베어스',   time: '18:30', stadium: '잠실',              broadcast: 'KBS N 스포츠' },
    { away: 'LG 트윈스',    home: 'SSG 랜더스',    time: '18:30', stadium: '인천SSG랜더스필드',   broadcast: '스포티비' },
    { away: '삼성 라이온즈', home: '한화 이글스',   time: '18:30', stadium: '대전한화생명볼파크',  broadcast: 'MBC스포츠+' },
  ],
  '5/23': [
    { away: '두산 베어스',   home: 'KIA 타이거즈',  time: '18:30', stadium: '광주기아챔피언스필드', broadcast: 'KBS N 스포츠' },
    { away: 'SSG 랜더스',   home: 'LG 트윈스',     time: '18:30', stadium: '잠실',               broadcast: '스포티비' },
    { away: '한화 이글스',   home: '삼성 라이온즈', time: '18:30', stadium: '대구삼성라이온즈파크', broadcast: 'MBC스포츠+' },
    { away: 'NC 다이노스',  home: '롯데 자이언츠', time: '18:30', stadium: '사직',               broadcast: '스포티비2' },
    { away: 'KT 위즈',      home: '키움 히어로즈', time: '18:30', stadium: '고척스카이돔',        broadcast: 'TVING' },
  ],
};

const DATES     = ['5/17', '5/18', '5/19', '5/20', '5/21', '5/22', '5/23'];
const DAY_NAMES = ['토', '일', '월', '화', '수', '목', '금'];
const TODAY     = '5/20';

export default function GamesScreen() {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const scrollRef = useRef<ScrollView>(null);
  const { colors, isDark } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const games = SCHEDULE[selectedDate] ?? [];

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>오늘의 경기</Text>

      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dateSlider}>
        {DATES.map((date, i) => {
          const isSelected = selectedDate === date;
          const isToday = date === TODAY;
          return (
            <TouchableOpacity
              key={date}
              style={[s.dateItem, isSelected && { backgroundColor: colors.accent }]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[s.dayName, isSelected && s.dateTextSelected]}>{DAY_NAMES[i]}</Text>
              <Text style={[s.dateNum, isSelected && s.dateTextSelected]}>{date.split('/')[1]}</Text>
              {isToday && <View style={[s.todayDot, isSelected && s.todayDotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={s.gameList}>
        {games.length === 0 ? (
          <View style={s.noGame}>
            <Text style={s.noGameText}>경기 없음</Text>
          </View>
        ) : (
          games.map((g, i) => {
            const ac = TEAM_COLORS[g.away];
            const hc = TEAM_COLORS[g.home];
            const awayBg = isDark ? ac.background : ac.lightBg;
            const homeBg = isDark ? hc.background : hc.lightBg;
            const AwayLogo = TEAM_LOGOS[g.away];
            const HomeLogo = TEAM_LOGOS[g.home];
            return (
              <View key={i} style={s.gameCard}>
                <View style={s.teamsRow}>
                  <View style={s.teamBlock}>
                    <View style={[s.teamBadge, { backgroundColor: awayBg, borderColor: ac.primary }]}>
                      <AwayLogo width={38} height={38} />
                    </View>
                    <Text style={s.teamName}>{g.away}</Text>
                  </View>

                  <View style={s.gameCenter}>
                    <Text style={s.gameTime}>{g.time}</Text>
                    <Text style={s.gameStadium}>{g.stadium}</Text>
                  </View>

                  <View style={s.teamBlock}>
                    <View style={[s.teamBadge, { backgroundColor: homeBg, borderColor: hc.primary }]}>
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
  container:       { flex: 1, backgroundColor: c.bg },
  title:           { fontSize: 20, fontWeight: 'bold', color: c.text, paddingHorizontal: 16, paddingVertical: 14 },
  dateSlider:      { paddingHorizontal: 12, gap: 6, paddingBottom: 12 },
  dateItem:        { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: c.card, minWidth: 52 },
  dayName:         { fontSize: 11, color: c.textMuted, marginBottom: 2 },
  dateNum:         { fontSize: 16, fontWeight: 'bold', color: c.textSub },
  dateTextSelected:{ color: '#fff' },
  todayDot:        { width: 4, height: 4, borderRadius: 2, backgroundColor: c.accent, marginTop: 3 },
  todayDotSelected:{ backgroundColor: '#fff' },
  gameList:        { paddingHorizontal: 16, gap: 12, paddingBottom: 24 },
  noGame:          { alignItems: 'center', paddingTop: 60 },
  noGameText:      { color: c.textMuted, fontSize: 15 },
  gameCard:        { backgroundColor: c.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: c.border },
  teamsRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  teamBlock:       { alignItems: 'center', flex: 1 },
  teamBadge:       { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  teamName:        { fontSize: 11, color: c.textMuted, textAlign: 'center' },
  gameCenter:      { alignItems: 'center', flex: 1 },
  gameTime:        { fontSize: 18, fontWeight: 'bold', color: c.text },
  gameStadium:     { fontSize: 11, color: c.textMuted, marginTop: 4, textAlign: 'center' },
  cardFooter:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: c.border, paddingTop: 10 },
  broadcastText:   { fontSize: 12, color: c.textMuted },
  previewBtn:      { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  previewText:     { color: '#fff', fontSize: 12, fontWeight: '600' },
});
