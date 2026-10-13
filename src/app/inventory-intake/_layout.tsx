import { Stack } from 'expo-router';

export default function InventoryFlowLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-item" />
      <Stack.Screen name="verify-photo" />
      <Stack.Screen name="review-batch" />
    </Stack>
  );
}
