import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';

import { ItemEditCard } from '@/components/inventory/item-edit-card';
import { PhotoSourceSheet } from '@/components/inventory/photo-source-sheet';
import { Screen } from '@/components/screen';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { scanImageForIngredients } from '@/services/mockVisionScan';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  removePhotoCandidate,
  setPhotoCandidates,
  setProcessing,
  stageCurrentCandidates,
  updatePhotoCandidate,
} from '@/store/slices/scanSessionSlice';
import { pickImageFromLibrary } from '@/utils/imagePicker';

export default function VerifyPhotoScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const dispatch = useAppDispatch();
  const candidates = useAppSelector((state) => state.scanSession.currentPhotoCandidates);
  const isProcessing = useAppSelector((state) => state.scanSession.isProcessing);
  const stagedCount = useAppSelector((state) => state.scanSession.stagedItems.length);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scannedUriRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageUri || scannedUriRef.current === imageUri) return;
    scannedUriRef.current = imageUri;

    dispatch(setProcessing(true));
    scanImageForIngredients().then((items) => dispatch(setPhotoCandidates(items)));
  }, [imageUri, dispatch]);

  const handleCancel = () => {
    dispatch(setPhotoCandidates([]));
    router.replace(stagedCount > 0 ? '/inventory-intake/review-batch' : '/(tabs)/inventory');
  };

  const handleDone = () => {
    dispatch(stageCurrentCandidates());
    router.replace('/inventory-intake/review-batch');
  };

  const handleTakePhoto = () => {
    Alert.alert('Camera Disabled', 'Camera is disabled in the simulator — use "Upload from Library" instead.');
  };

  const handleUploadFromLibrary = async () => {
    const uri = await pickImageFromLibrary();
    // Cancelling the system picker is a true no-op — stay here with current edits intact.
    if (!uri) return;

    dispatch(stageCurrentCandidates());
    router.replace({ pathname: '/inventory-intake/verify-photo', params: { imageUri: uri } });
  };

  return (
    <Screen>
      <HStack className="items-center justify-between px-6 pt-4">
        <Pressable onPress={handleCancel} className="active:opacity-70">
          <Text className="text-harvest-slate-light">Cancel</Text>
        </Pressable>
        <Text className="text-xl font-bold text-harvest-slate">Verify Items</Text>
        <Text className="text-harvest-white">Cancel</Text>
      </HStack>

      <HStack space="sm" className="items-center px-6 pt-4">
        {imageUri && (
          <Image source={{ uri: imageUri }} style={{ width: 64, height: 64, borderRadius: 12 }} />
        )}
        <Text className="text-harvest-slate-light">
          {isProcessing
            ? 'Scanning your photo…'
            : `${candidates.length} item${candidates.length === 1 ? '' : 's'} found`}
        </Text>
      </HStack>

      {isProcessing ? (
        <VStack style={{ flex: 1 }} className="items-center justify-center gap-3">
          <Spinner size="large" color="#7BA05B" />
          <Text className="text-harvest-slate-light">Identifying ingredients…</Text>
        </VStack>
      ) : (
        <ScrollView contentContainerStyle={{ gap: 16, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
          {candidates.length === 0 && (
            <Text className="pt-10 text-center text-harvest-slate-light">
              No items detected. Try another photo or add items manually from Tab 1.
            </Text>
          )}
          {candidates.map((item) => (
            <ItemEditCard
              key={item.id}
              item={item}
              onChange={(changes) => dispatch(updatePhotoCandidate({ id: item.id, changes }))}
              onRemove={() => dispatch(removePhotoCandidate(item.id))}
            />
          ))}
        </ScrollView>
      )}

      <VStack space="sm" className="px-6 pb-6 pt-2">
        <Pressable
          disabled={isProcessing}
          onPress={() => setIsSheetOpen(true)}
          className="items-center rounded-full border border-harvest-green py-4 active:opacity-70 disabled:opacity-40">
          <Text className="text-base font-semibold text-harvest-green-dark">+ Add Another Photo</Text>
        </Pressable>
        <Pressable
          disabled={isProcessing}
          onPress={handleDone}
          className="items-center rounded-full bg-harvest-green py-4 active:opacity-70 disabled:opacity-40">
          <Text className="text-base font-semibold text-harvest-white">Done / Review All</Text>
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
