import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
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
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </TodoProviderWithPet>
    </PetProvider>
  );
}
