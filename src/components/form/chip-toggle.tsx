import { Pressable } from 'react-native';

import { Text } from '@/components/ui/text';

interface ChipToggleProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function ChipToggle({ label, selected, onPress }: ChipToggleProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 active:opacity-70 ${
        selected ? 'border-harvest-green bg-harvest-green' : 'border-harvest-slate-light/40 bg-harvest-white'
      }`}>
      <Text className={selected ? 'font-semibold text-harvest-white' : 'text-harvest-slate'}>
        {label}
      </Text>
    </Pressable>
  );
}
