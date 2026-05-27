import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

type Props = { width?: number | string; height?: number; radius?: number; style?: ViewStyle };

export function SkeletonBox({ width = '100%', height = 16, radius = 8, style }: Props) {
  const { colors } = useAppTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.border, opacity },
        style,
      ]}
    />
  );
}

export function GameCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.teamsRow}>
        {[0, 1].map((side) => (
          <View key={side} style={s.teamBlock}>
            <SkeletonBox width={52} height={52} radius={26} />
            <SkeletonBox width={60} height={11} radius={4} style={{ marginTop: 8 }} />
          </View>
        ))}
        <View style={s.center}>
          <SkeletonBox width={50} height={20} radius={6} />
          <SkeletonBox width={70} height={11} radius={4} style={{ marginTop: 6 }} />
        </View>
      </View>
      <View style={[s.footer, { borderTopColor: colors.border }]}>
        <SkeletonBox width={80} height={12} radius={4} />
        <SkeletonBox width={56} height={28} radius={8} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card:      { borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 12 },
  teamsRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  teamBlock: { alignItems: 'center', flex: 1 },
  center:    { alignItems: 'center', flex: 1, gap: 0 },
  footer:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10 },
});
