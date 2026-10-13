import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { Screen } from '@/components/screen';

import { ChipToggle } from '@/components/form/chip-toggle';
import { Stepper } from '@/components/form/stepper';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setHealthProfile } from '@/store/slices/healthProfileSlice';
import { CuisineType, DietaryRestriction, SkillLevel } from '@/types/healthProfile';
import { toTitleCase } from '@/utils/text';

const DIETARY_RESTRICTIONS = Object.values(DietaryRestriction);
const CUISINES = Object.values(CuisineType);
const SKILL_LEVELS = Object.values(SkillLevel);

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function CreateHealthProfileScreen() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.healthProfile.profile);
  const isOnboarded = useAppSelector((state) => state.healthProfile.isOnboarded);

  const [dietaryRestrictions, setDietaryRestrictions] = useState(profile.dietaryRestrictions);
  const [preferredCuisines, setPreferredCuisines] = useState(profile.preferredCuisines);
  const [allergies, setAllergies] = useState(profile.allergies);
  const [allergyDraft, setAllergyDraft] = useState('');
  const [servings, setServings] = useState(profile.servings);
  const [skillLevel, setSkillLevel] = useState(profile.skillLevel);

  const addAllergy = () => {
    const trimmed = allergyDraft.trim();
    if (trimmed.length > 0 && !allergies.includes(trimmed)) {
      setAllergies([...allergies, trimmed]);
    }
    setAllergyDraft('');
  };

  const handleSubmit = () => {
    dispatch(
      setHealthProfile({
        id: profile.id,
        dietaryRestrictions,
        preferredCuisines,
        allergies,
        servings,
        skillLevel,
      }),
    );
    router.replace(isOnboarded ? '/(tabs)/profile' : '/(tabs)/inventory');
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ gap: 24, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled">
          <VStack space="xs">
            <Text className="text-2xl font-bold text-harvest-slate">
              {isOnboarded ? 'Edit Your Health Profile' : 'Create Your Health Profile'}
            </Text>
            <Text className="text-harvest-slate-light">
              Tell us your preferences so recipes fit your diet, taste, and skill level.
            </Text>
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Dietary Restrictions</Text>
            <HStack className="flex-wrap" space="sm">
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <ChipToggle
                  key={restriction}
                  label={toTitleCase(restriction)}
                  selected={dietaryRestrictions.includes(restriction)}
                  onPress={() => setDietaryRestrictions(toggleInArray(dietaryRestrictions, restriction))}
                />
              ))}
            </HStack>
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Allergies</Text>
            <HStack className="items-center" space="sm">
              <Input className="flex-1">
                <InputField
                  placeholder="e.g. peanuts"
                  value={allergyDraft}
                  onChangeText={setAllergyDraft}
                  onSubmitEditing={addAllergy}
                  returnKeyType="done"
                />
              </Input>
              <Pressable
                onPress={addAllergy}
                className="rounded-full bg-harvest-green px-4 py-2 active:opacity-70">
                <Text className="font-semibold text-harvest-white">Add</Text>
              </Pressable>
            </HStack>
            {allergies.length > 0 && (
              <HStack className="flex-wrap" space="sm">
                {allergies.map((allergy) => (
                  <ChipToggle
                    key={allergy}
                    label={`${allergy} ×`}
                    selected
                    onPress={() => setAllergies(allergies.filter((item) => item !== allergy))}
                  />
                ))}
              </HStack>
            )}
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Preferred Cuisines</Text>
            <HStack className="flex-wrap" space="sm">
              {CUISINES.map((cuisine) => (
                <ChipToggle
                  key={cuisine}
                  label={toTitleCase(cuisine)}
                  selected={preferredCuisines.includes(cuisine)}
                  onPress={() => setPreferredCuisines(toggleInArray(preferredCuisines, cuisine))}
                />
              ))}
            </HStack>
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Servings</Text>
            <Stepper value={servings} onChange={setServings} min={1} max={12} />
          </VStack>

          <VStack space="sm">
            <Text className="font-semibold text-harvest-slate">Skill Level</Text>
            <HStack className="flex-wrap" space="sm">
              {SKILL_LEVELS.map((level) => (
                <ChipToggle
                  key={level}
                  label={toTitleCase(level)}
                  selected={skillLevel === level}
                  onPress={() => setSkillLevel(level)}
                />
              ))}
            </HStack>
          </VStack>

          <Pressable
            onPress={handleSubmit}
            className="mt-2 items-center rounded-full bg-harvest-green py-4 active:opacity-70">
            <Text className="text-base font-semibold text-harvest-white">
              {isOnboarded ? 'Save Changes' : 'Create Profile'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
