import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';

import { ItemEditCard } from '@/components/inventory/item-edit-card';
import { PhotoSourceSheet } from '@/components/inventory/photo-source-sheet';
import { Screen } from '@/components/screen';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { mergeItems } from '@/store/slices/fridgeInventorySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSession, removeStagedItem, updateStagedItem } from '@/store/slices/scanSessionSlice';
import { pickImageFromLibrary } from '@/utils/imagePicker';

export default function ReviewBatchScreen() {
  const dispatch = useAppDispatch();
  const stagedItems = useAppSelector((state) => state.scanSession.stagedItems);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const hasItems = stagedItems.length > 0;

  const handleDiscard = () => {
    Alert.alert('Discard all scanned items?', 'This cannot be undone.', [
      { text: 'Keep Reviewing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          dispatch(clearSession());
          router.replace('/(tabs)/inventory');
        },
      },
    ]);
  };

  const handleFinish = () => {
    if (!hasItems) return;
    dispatch(mergeItems(stagedItems));
    dispatch(clearSession());
    router.replace('/(tabs)/inventory');
    Alert.alert('Added to Fridge', `${stagedItems.length} item${stagedItems.length === 1 ? '' : 's'} added.`);
  };

  const handleTakePhoto = () => {
    Alert.alert('Camera Disabled', 'Camera is disabled in the simulator — use "Upload from Library" instead.');
  };

  const handleUploadFromLibrary = async () => {
    const uri = await pickImageFromLibrary();
    // Cancelling the system picker is a true no-op.
    if (!uri) return;
    router.replace({ pathname: '/inventory-intake/verify-photo', params: { imageUri: uri } });
  };

  return (
    <Screen>
      <HStack className="items-center justify-between px-6 pt-4">
        <Pressable onPress={handleDiscard} className="active:opacity-70">
          <Text className="font-semibold text-destructive">Discard</Text>
        </Pressable>
        <Text className="text-xl font-bold text-harvest-slate">Review All Items</Text>
        <Text className="text-harvest-white">Discard</Text>
      </HStack>
      <Text className="px-6 pt-1 text-harvest-slate-light">
        {stagedItems.length} item{stagedItems.length === 1 ? '' : 's'} ready to add
      </Text>

      <ScrollView contentContainerStyle={{ gap: 16, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        {!hasItems && (
          <Text className="pt-10 text-center text-harvest-slate-light">
            Nothing staged yet. Add a photo to get started.
          </Text>
        )}
        {stagedItems.map((item) => (
          <ItemEditCard
            key={item.id}
            item={item}
            onChange={(changes) => dispatch(updateStagedItem({ id: item.id, changes }))}
            onRemove={() => dispatch(removeStagedItem(item.id))}
          />
        ))}
      </ScrollView>

      <VStack space="sm" className="px-6 pb-6 pt-2">
        <Pressable
          onPress={handleFinish}
          disabled={!hasItems}
          className={`items-center rounded-full py-4 active:opacity-70 ${
            hasItems ? 'bg-harvest-green' : 'bg-harvest-slate-light/30'
          }`}>
          <Text className="text-base font-semibold text-harvest-white">Finish &amp; Add to Fridge</Text>
        </Pressable>
        <Pressable
          onPress={() => setIsSheetOpen(true)}
          className={`items-center rounded-full border py-4 active:opacity-70 ${
            hasItems ? 'border-harvest-green' : 'border-harvest-green bg-harvest-green'
          }`}>
          <Text className={`text-base font-semibold ${hasItems ? 'text-harvest-green-dark' : 'text-harvest-white'}`}>
            + Add Another Photo
          </Text>
        </Pressable>
      </VStack>

      <PhotoSourceSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onTakePhoto={handleTakePhoto}
        onUploadFromLibrary={handleUploadFromLibrary}
      />
    </Screen>
  );
}
