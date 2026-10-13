import { Pressable } from 'react-native';

import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ value, onChange, min = 1, max = 99 }: StepperProps) {
  return (
    <HStack className="items-center gap-4" space="md">
      <Pressable
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
        className="h-10 w-10 items-center justify-center rounded-full bg-harvest-offwhite active:opacity-70 disabled:opacity-30">
        <Text className="text-xl font-bold text-harvest-slate">–</Text>
      </Pressable>

      <Text className="w-8 text-center text-lg font-semibold text-harvest-slate">{value}</Text>

      <Pressable
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        className="h-10 w-10 items-center justify-center rounded-full bg-harvest-offwhite active:opacity-70 disabled:opacity-30">
        <Text className="text-xl font-bold text-harvest-slate">+</Text>
      </Pressable>
    </HStack>
  );
}
