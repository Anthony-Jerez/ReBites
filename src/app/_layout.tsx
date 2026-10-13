import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/src/global.css';
import { store } from '@/store';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Provider store={store}>
      <GluestackUIProvider mode="system">
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="inventory-intake" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    </Provider>
  );
}
