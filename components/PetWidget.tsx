import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { usePet } from '../context/PetContext';
import { XPBar } from './XPBar';

export function PetWidget() {
  const { progress } = usePet();

  return (
    <Link href="/pet" asChild>
      <Pressable style={styles.card}>
        <Text style={styles.emoji}>{progress.stage.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.stageName}>
            {progress.stage.name} · Lv {progress.level}
          </Text>
          <XPBar
            progressRatio={progress.progressRatio}
            xpIntoStage={progress.xpIntoStage}
            xpForNextStage={progress.xpForNextStage}
            isMaxStage={progress.isMaxStage}
          />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emoji: { fontSize: 40 },
  info: { flex: 1 },
  stageName: { ...typography.body, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
});
