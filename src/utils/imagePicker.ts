import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Returns the picked image's local URI, or null if the user cancelled or
// denied library access (an alert is shown for the denied case).
export async function pickImageFromLibrary(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Photo Access Needed',
      'Enable photo library access in Settings to scan fridge items from your library.',
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 0.7,
  });

  if (result.canceled || result.assets.length === 0) return null;
  return result.assets[0].uri;
}
