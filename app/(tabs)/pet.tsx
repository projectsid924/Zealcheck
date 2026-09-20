import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PetAvatar } from '../../components/PetAvatar';
import { XPBar } from '../../components/XPBar';
import { colors, spacing, typography } from '../../constants/theme';
import { usePet } from '../../context/PetContext';

export default function PetScreen() {
  const { progress, xp, leveledUp, acknowledgeLevelUp } = usePet();

  useEffect(() => {
    if (leveledUp) {
      const timeout = setTimeout(acknowledgeLevelUp, 1200);
      return () => clearTimeout(timeout);
    }
  }, [leveledUp, acknowledgeLevelUp]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Pet</Text>
        <PetAvatar
          emoji={progress.stage.emoji}
          stageName={progress.stage.name}
          level={progress.level}
          pulse={leveledUp}
        />
        <XPBar
          progressRatio={progress.progressRatio}
          xpIntoStage={progress.xpIntoStage}
          xpForNextStage={progress.xpForNextStage}
          isMaxStage={progress.isMaxStage}
        />
        {leveledUp ? <Text style={styles.levelUpText}>Level up! 🎉</Text> : null}
        <Text style={styles.totalXp}>Total XP: {xp}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  header: { ...typography.title, color: colors.text, marginBottom: spacing.sm },
  levelUpText: { ...typography.heading, color: colors.success, textAlign: 'center', marginTop: spacing.md },
  totalXp: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
});
