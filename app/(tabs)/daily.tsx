import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MealCard } from '../../components/MealCard';
import { ProfileForm } from '../../components/ProfileForm';
import { ProgressBar } from '../../components/ProgressBar';
import { WaterTracker } from '../../components/WaterTracker';
import { colors, spacing, typography } from '../../constants/theme';
import { useHealth, type Meal } from '../../context/HealthContext';

const MEALS: { key: Meal; label: string; icon: 'sunny-outline' | 'restaurant-outline' | 'moon-outline' }[] = [
  { key: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' },
  { key: 'lunch', label: 'Lunch', icon: 'restaurant-outline' },
  { key: 'dinner', label: 'Dinner', icon: 'moon-outline' },
];

export default function DailyScreen() {
  const {
    profile,
    isLoading,
    saveProfile,
    calorieTarget,
    waterTarget,
    todayLog,
    setWaterGlasses,
    toggleMeal,
    setMealCalories,
    caloriesEaten,
  } = useHealth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (isLoading) return null;

  const showForm = !profile || isEditingProfile;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Daily Health</Text>

        {showForm ? (
          <ProfileForm
            initialProfile={profile}
            onSave={(p) => {
              saveProfile(p);
              setIsEditingProfile(false);
            }}
            onCancel={profile ? () => setIsEditingProfile(false) : undefined}
          />
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.heading}>Calories</Text>
                <Pressable onPress={() => setIsEditingProfile(true)}>
                  <Text style={styles.editLink}>Edit profile</Text>
                </Pressable>
              </View>
              <ProgressBar
                ratio={calorieTarget ? caloriesEaten / calorieTarget : 0}
                label={`${caloriesEaten} / ${calorieTarget} kcal`}
                fillColor={caloriesEaten > (calorieTarget ?? Infinity) ? colors.danger : colors.primary}
              />
            </View>

            <WaterTracker glasses={todayLog.waterGlasses} target={waterTarget} onChange={setWaterGlasses} />

            <Text style={styles.sectionHeading}>Meals</Text>
            {MEALS.map(({ key, label, icon }) => (
              <MealCard
                key={key}
                label={label}
                icon={icon}
                completed={todayLog.meals[key].completed}
                calories={todayLog.meals[key].calories}
                onToggle={() => toggleMeal(key)}
                onCaloriesChange={(calories) => setMealCalories(key, calories)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  header: { ...typography.title, color: colors.text, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  heading: { ...typography.heading, color: colors.text },
  editLink: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  sectionHeading: { ...typography.heading, color: colors.text, marginBottom: spacing.sm },
});
