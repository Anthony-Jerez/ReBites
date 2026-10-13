import type { ReactNode } from 'react';
import { View } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  edges?: readonly Edge[];
}

// SafeAreaView ignores className (no flex, no background), so the Crisp Harvest
// background lives on a plain View wrapped around it.
export function Screen({ children, edges }: ScreenProps) {
  return (
    <View style={{ flex: 1 }} className="bg-harvest-white">
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}
