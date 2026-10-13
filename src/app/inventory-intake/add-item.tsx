import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { Screen } from '@/components/screen';

import { ChipToggle } from '@/components/form/chip-toggle';
import { ExpirationPicker } from '@/components/form/expiration-picker';
import { Stepper } from '@/components/form/stepper';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/fridgeInventorySlice';
import { IngredientCategory, IngredientUnit } from '@/types/fridgeInventory';
import { toTitleCase } from '@/utils/text';

const UNITS = Object.values(IngredientUnit);
const CATEGORIES = Object.values(IngredientCategory);

export default function AddItemScreen() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<IngredientUnit>(IngredientUnit.PIECE);
  const [category, setCategory] = useState<IngredientCategory>(IngredientCategory.PRODUCE);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setQuantity(1);
    setUnit(IngredientUnit.PIECE);
    setCategory(IngredientCategory.PRODUCE);
    setExpirationDate(null);
  };

  const submit = () => {
    if (name.trim().length === 0) return false;
    dispatch(
      addItem({ name: name.trim(), quantity, unit, category, expirationDate }),
    );
    return true;
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 24, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }}>
          <HStack className="items-center justify-between">
            <Pressable onPress={() => router.back()} className="active:opacity-70">
              <Text className="text-harvest-slate-light">Cancel</Text>
            </Pressable>
            <Text className="text-xl font-bold text-harvest-slate">Add Item</Text>
            <Text className="text-harvest-white">Cancel</Text>
          </HStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Name</Text>
            <Input>
              <InputField placeholder="e.g. Tomatoes" value={name} onChangeText={setName} />
            </Input>
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Quantity</Text>
            <Stepper value={quantity} onChange={setQuantity} min={1} max={99} />
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Unit</Text>
            <HStack className="flex-wrap" space="sm">
              {UNITS.map((u) => (
                <ChipToggle key={u} label={toTitleCase(u)} selected={unit === u} onPress={() => setUnit(u)} />
              ))}
            </HStack>
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Category</Text>
            <HStack className="flex-wrap" space="sm">
              {CATEGORIES.map((c) => (
                <ChipToggle key={c} label={toTitleCase(c)} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </HStack>
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Expiration</Text>
            <ExpirationPicker value={expirationDate} onChange={setExpirationDate} />
          </VStack>

          <VStack space="sm">
            <Pressable
              onPress={() => {
                if (submit()) router.back();
              }}
              className="items-center rounded-full bg-harvest-green py-4 active:opacity-70">
              <Text className="text-base font-semibold text-harvest-white">Add to Fridge</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (submit()) resetForm();
              }}
              className="items-center rounded-full border border-harvest-green py-4 active:opacity-70">
              <Text className="text-base font-semibold text-harvest-green-dark">Save &amp; Add Another</Text>
            </Pressable>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
