import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

type Props = {
  emoji: string;
  stageName: string;
  level: number;
  pulse: boolean;
};

export function PetAvatar({ emoji, stageName, level, pulse }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, friction: 3 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  }, [pulse, scale]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.emoji, { transform: [{ scale }] }]}>{emoji}</Animated.Text>
      <Text style={styles.stageName}>{stageName}</Text>
      <Text style={styles.level}>Level {level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.lg },
  emoji: { fontSize: 96 },
  stageName: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  level: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
});
