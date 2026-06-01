import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const KR_DAYS_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

type Props = {
  visible: boolean;
  selectedIso: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
};

export default function CalendarModal({ visible, selectedIso, onSelect, onClose }: Props) {
  const { colors } = useAppTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=일
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= lastDate; d++) cells.push(d);
    // 6주 채우기
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  function toIso(day: number) {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const todayIso = today.toISOString().split('T')[0];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />

          {/* 헤더 */}
          <View style={s.header}>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={s.monthTitle}>{viewYear}년 {viewMonth + 1}월</Text>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn}>
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={s.weekRow}>
            {KR_DAYS_SHORT.map((d, i) => (
              <Text key={d} style={[s.weekDay, i === 0 && s.sunday, i === 6 && s.saturday]}>{d}</Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={s.grid}>
            {days.map((day, idx) => {
              if (!day) return <View key={idx} style={s.cell} />;
              const iso = toIso(day);
              const isSelected = iso === selectedIso;
              const isToday = iso === todayIso;
              const dow = idx % 7;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[s.cell, isSelected && { backgroundColor: colors.accent, borderRadius: 8 }]}
                  onPress={() => { onSelect(iso); onClose(); }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    s.dayNum,
                    dow === 0 && s.sunday,
                    dow === 6 && s.saturday,
                    isSelected && { color: '#fff', fontWeight: 'bold' },
                    isToday && !isSelected && { color: colors.accent, fontWeight: 'bold' },
                  ]}>{day}</Text>
                  {isToday && !isSelected && <View style={[s.todayDot, { backgroundColor: colors.accent }]} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={[s.closeTxt, { color: colors.textMuted }]}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: ReturnType<typeof useAppTheme>['colors']) => StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32 },
  handle:     { width: 40, height: 4, backgroundColor: c.border, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  navBtn:     { padding: 8 },
  monthTitle: { fontSize: 18, fontWeight: 'bold', color: c.text },
  weekRow:    { flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 8 },
  weekDay:    { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: c.textMuted },
  sunday:     { color: '#ef4444' },
  saturday:   { color: '#3b82f6' },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  cell:       { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayNum:     { fontSize: 15, color: c.text },
  todayDot:   { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  closeBtn:   { alignSelf: 'center', marginTop: 16, paddingHorizontal: 24, paddingVertical: 8 },
  closeTxt:   { fontSize: 14 },
});
