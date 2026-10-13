import { Pressable } from 'react-native';

import { ChipToggle } from '@/components/form/chip-toggle';
import { ExpirationPicker } from '@/components/form/expiration-picker';
import { Stepper } from '@/components/form/stepper';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { type FridgeItem, IngredientCategory, IngredientUnit } from '@/types/fridgeInventory';
import { toTitleCase } from '@/utils/text';

const UNITS = Object.values(IngredientUnit);
const CATEGORIES = Object.values(IngredientCategory);

interface ItemEditCardProps {
  item: FridgeItem;
  onChange: (changes: Partial<FridgeItem>) => void;
  onRemove: () => void;
}

export function ItemEditCard({ item, onChange, onRemove }: ItemEditCardProps) {
  return (
    <VStack space="sm" className="rounded-2xl bg-harvest-offwhite p-4">
      <HStack className="items-center justify-between">
        <Input className="flex-1">
          <InputField
            value={item.name}
            onChangeText={(name) => onChange({ name })}
            placeholder="Item name"
          />
        </Input>
        <Pressable onPress={onRemove} className="ml-3 active:opacity-70">
          <Text className="font-semibold text-destructive">Remove</Text>
        </Pressable>
      </HStack>

      <HStack className="items-center justify-between">
        <Text className="text-sm text-harvest-slate-light">Quantity</Text>
        <Stepper value={item.quantity} onChange={(quantity) => onChange({ quantity })} min={1} max={99} />
      </HStack>

      <VStack space="xs">
        <Text className="text-sm text-harvest-slate-light">Unit</Text>
        <HStack className="flex-wrap" space="sm">
          {UNITS.map((unit) => (
            <ChipToggle
              key={unit}
              label={toTitleCase(unit)}
              selected={item.unit === unit}
              onPress={() => onChange({ unit })}
            />
          ))}
        </HStack>
      </VStack>

      <VStack space="xs">
        <Text className="text-sm text-harvest-slate-light">Category</Text>
        <HStack className="flex-wrap" space="sm">
          {CATEGORIES.map((category) => (
            <ChipToggle
              key={category}
              label={toTitleCase(category)}
              selected={item.category === category}
              onPress={() => onChange({ category })}
            />
          ))}
        </HStack>
      </VStack>

      <VStack space="xs">
        <Text className="text-sm text-harvest-slate-light">Expiration</Text>
        <ExpirationPicker
          value={item.expirationDate}
          onChange={(expirationDate) => onChange({ expirationDate })}
        />
      </VStack>
    </VStack>
  );
}
