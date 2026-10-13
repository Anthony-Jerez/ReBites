import { Screen } from '@/components/screen';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function RecipesScreen() {
  return (
    <Screen>
      <VStack style={{ flex: 1 }} className="items-center justify-center gap-2 px-6" space="sm">
        <Text className="text-center text-2xl font-bold text-harvest-slate">Recipes</Text>
        <Text className="text-center text-harvest-slate-light">
          Generated recipe cards will appear here.
        </Text>
      </VStack>
    </Screen>
  );
}
