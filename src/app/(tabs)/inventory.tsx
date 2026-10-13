import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChipToggle } from '@/components/form/chip-toggle';
import { PhotoSourceSheet } from '@/components/inventory/photo-source-sheet';
import { Screen } from '@/components/screen';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAppSelector } from '@/store/hooks';
import { selectAllFridgeItems } from '@/store/slices/fridgeInventorySlice';
import { FridgeItem, IngredientCategory } from '@/types/fridgeInventory';
import { pickImageFromLibrary } from '@/utils/imagePicker';
import { toTitleCase } from '@/utils/text';

const CATEGORY_ORDER = [
  IngredientCategory.PRODUCE,
  IngredientCategory.PROTEIN,
  IngredientCategory.DAIRY,
  IngredientCategory.GRAIN,
  IngredientCategory.BAKERY,
  IngredientCategory.FROZEN,
  IngredientCategory.BEVERAGE,
  IngredientCategory.CONDIMENT,
  IngredientCategory.SPICE,
  IngredientCategory.OTHER,
];

function daysUntil(dateIso: string): number {
  const diffMs = new Date(dateIso).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function ExpirationLabel({ item }: { item: FridgeItem }) {
  if (!item.expirationDate) return null;

  const days = daysUntil(item.expirationDate);
  const label = days <= 0 ? 'Expires today' : `Expires in ${days}d`;

  return (
    <Text className={days <= 2 ? 'text-sm text-destructive' : 'text-sm text-harvest-slate-light'}>
      {label}
    </Text>
  );
}

export default function InventoryScreen() {
  const items = useAppSelector(selectAllFridgeItems);
  const insets = useSafeAreaInsets();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<IngredientCategory | 'all'>('all');

  const handleTakePhoto = () => {
    Alert.alert('Camera Disabled', 'Camera is disabled in the simulator — use "Upload from Library" instead.');
  };

  const handleUploadFromLibrary = async () => {
    const uri = await pickImageFromLibrary();
    // Cancelling the system picker is a true no-op.
    if (!uri) return;
    router.push({ pathname: '/inventory-intake/verify-photo', params: { imageUri: uri } });
  };

  const handleAddManually = () => {
    router.push('/inventory-intake/add-item');
  };

  const sections = useMemo(() => {
    const targetCategories =
      selectedFilter === 'all'
        ? CATEGORY_ORDER
        : CATEGORY_ORDER.filter((cat) => cat === selectedFilter);

    return targetCategories
      .map((category) => ({
        category,
        data: items.filter((item) => item.category === category),
      }))
      .filter((section) => section.data.length > 0);
  }, [items, selectedFilter]);

  return (
    <Screen edges={['top', 'left', 'right']}>
      {/* Header */}
      <HStack className="items-center justify-between px-6 pt-4" space="sm">
        <VStack space="xs">
          <Text className="text-2xl font-bold text-harvest-slate">Fridge Inventory</Text>
          <Text className="text-harvest-slate-light">
            {items.length} item{items.length === 1 ? '' : 's'} tracked
          </Text>
        </VStack>
        <Pressable
          onPress={() => setIsSheetOpen(true)}
          className="h-11 w-11 items-center justify-center rounded-full bg-harvest-green active:opacity-70">
          <Text className="text-2xl leading-none text-harvest-white">+</Text>
        </Pressable>
      </HStack>

      {/* Horizontal Filter Bar */}
      <View className="py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          <ChipToggle
            label="All"
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
          />
          {CATEGORY_ORDER.map((category) => (
            <ChipToggle
              key={category}
              label={toTitleCase(category)}
              selected={selectedFilter === category}
              onPress={() => setSelectedFilter(category)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Virtualized Categorized List with Dynamic Bottom Inset */}
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 80 }, // Prevents bottom tab bar from obscuring final item
        ]}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View className="pb-1 pt-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-harvest-green-dark">
              {toTitleCase(section.category)}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <HStack className="items-center justify-between rounded-xl bg-harvest-offwhite px-4 py-3" space="sm">
            <VStack space="xs" className="flex-1 pr-2">
              <Text className="font-semibold text-harvest-slate" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-sm text-harvest-slate-light">
                {item.quantity} {toTitleCase(item.unit)}
                {item.quantity === 1 ? '' : 's'}
              </Text>
            </VStack>
            <ExpirationLabel item={item} />
          </HStack>
        )}
        ListEmptyComponent={
          <Text className="pt-10 text-center text-harvest-slate-light">
            {selectedFilter === 'all'
              ? 'Your fridge is empty. Tap + to add an item.'
              : `No items found in ${toTitleCase(selectedFilter)}.`}
          </Text>
        }
      />

      <PhotoSourceSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onTakePhoto={handleTakePhoto}
        onUploadFromLibrary={handleUploadFromLibrary}
        onAddManually={handleAddManually}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 8,
  },
});