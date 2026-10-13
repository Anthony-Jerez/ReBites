import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Screen } from '@/components/screen';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAppSelector } from '@/store/hooks';
import { selectAllFridgeItems } from '@/store/slices/fridgeInventorySlice';
import { toTitleCase } from '@/utils/text';

function Badge({ label }: { label: string }) {
  return (
    <Box className="rounded-full bg-harvest-offwhite px-3 py-1">
      <Text className="text-sm text-harvest-slate">{label}</Text>
    </Box>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box className="w-[48%] gap-1 rounded-xl bg-harvest-offwhite p-4 sm:w-[31%]">
      <Text className="text-2xl font-bold text-harvest-green-dark">{value}</Text>
      <Text className="text-sm text-harvest-slate-light">{label}</Text>
    </Box>
  );
}

export default function ProfileScreen() {
  const profile = useAppSelector((state) => state.healthProfile.profile);
  const fridgeItems = useAppSelector(selectAllFridgeItems);

  const categoryBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    fridgeItems.forEach((item) => {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    });
    return Array.from(counts.entries());
  }, [fridgeItems]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 32, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }}>
        <HStack className="items-center justify-between">
          <Text className="text-2xl font-bold text-harvest-slate">Profile</Text>
          <Pressable onPress={() => router.push('/')} className="active:opacity-70">
            <Text className="font-semibold text-harvest-green-dark">Edit Profile</Text>
          </Pressable>
        </HStack>

        <VStack space="md">
          <Text className="font-semibold text-harvest-slate">Settings</Text>

          <VStack space="xs">
            <Text className="text-sm text-harvest-slate-light">Skill Level</Text>
            <Text className="text-harvest-slate">{toTitleCase(profile.skillLevel)}</Text>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-harvest-slate-light">Default Servings</Text>
            <Text className="text-harvest-slate">{profile.servings}</Text>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-harvest-slate-light">Dietary Restrictions</Text>
            {profile.dietaryRestrictions.length > 0 ? (
              <HStack className="flex-wrap" space="sm">
                {profile.dietaryRestrictions.map((restriction) => (
                  <Badge key={restriction} label={toTitleCase(restriction)} />
                ))}
              </HStack>
            ) : (
              <Text className="text-harvest-slate-light">None set</Text>
            )}
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-harvest-slate-light">Allergies</Text>
            {profile.allergies.length > 0 ? (
              <HStack className="flex-wrap" space="sm">
                {profile.allergies.map((allergy) => (
                  <Badge key={allergy} label={allergy} />
                ))}
              </HStack>
            ) : (
              <Text className="text-harvest-slate-light">None set</Text>
            )}
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-harvest-slate-light">Preferred Cuisines</Text>
            {profile.preferredCuisines.length > 0 ? (
              <HStack className="flex-wrap" space="sm">
                {profile.preferredCuisines.map((cuisine) => (
                  <Badge key={cuisine} label={toTitleCase(cuisine)} />
                ))}
              </HStack>
            ) : (
              <Text className="text-harvest-slate-light">None set</Text>
            )}
          </VStack>
        </VStack>

        <VStack space="md">
          <Text className="font-semibold text-harvest-slate">Statistics</Text>
          <HStack className="flex-wrap justify-between gap-y-3">
            <StatCard label="Recipes Generated" value="0" />
            <StatCard label="Recipes Cooked" value="0" />
            <StatCard label="Top Cuisine (avg rating)" value="—" />
            <StatCard label="Fridge Items Tracked" value={String(fridgeItems.length)} />
          </HStack>
        </VStack>

        <VStack space="md">
          <Text className="font-semibold text-harvest-slate">Fridge Breakdown</Text>
          {categoryBreakdown.length > 0 ? (
            <HStack className="flex-wrap" space="sm">
              {categoryBreakdown.map(([category, count]) => (
                <Badge key={category} label={`${toTitleCase(category)}: ${count}`} />
              ))}
            </HStack>
          ) : (
            <Text className="text-harvest-slate-light">No items tracked yet.</Text>
          )}
        </VStack>
      </ScrollView>
    </Screen>
  );
}
