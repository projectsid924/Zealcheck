import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { HealthProvider } from '../context/HealthContext';
import { PetProvider, usePet } from '../context/PetContext';
import { TodoProvider } from '../context/TodoContext';

function TodoProviderWithPet({ children }: { children: ReactNode }) {
  const { awardXp } = usePet();
  return <TodoProvider onComplete={() => awardXp()}>{children}</TodoProvider>;
}

export default function RootLayout() {
  return (
    <PetProvider>
      <TodoProviderWithPet>
        <HealthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </HealthProvider>
      </TodoProviderWithPet>
    </PetProvider>
  );
}
