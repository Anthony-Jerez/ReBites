import { ChipToggle } from '@/components/form/chip-toggle';
import { HStack } from '@/components/ui/hstack';

const EXPIRATION_PRESETS: { label: string; days: number | null }[] = [
  { label: 'None', days: null },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
];

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function daysUntil(dateIso: string): number {
  return Math.round((new Date(dateIso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

interface ExpirationPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function ExpirationPicker({ value, onChange }: ExpirationPickerProps) {
  const selectedDays = value ? daysUntil(value) : null;

  return (
    <HStack className="flex-wrap" space="sm">
      {EXPIRATION_PRESETS.map((preset) => (
        <ChipToggle
          key={preset.label}
          label={preset.label}
          selected={preset.days === selectedDays || (preset.days === null && !value)}
          onPress={() => onChange(preset.days === null ? null : daysFromNow(preset.days))}
        />
      ))}
    </HStack>
  );
}
