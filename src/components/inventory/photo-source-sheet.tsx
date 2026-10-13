import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';

// iOS silently drops an Alert or system picker presented while a native modal is
// still animating closed, so each action waits for the sheet's dismiss animation.
const DISMISS_ANIMATION_MS = 350;

interface PhotoSourceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onUploadFromLibrary: () => void;
  /** Omit to hide the "Add Manually" row — used when adding another photo mid-scan. */
  onAddManually?: () => void;
}

export function PhotoSourceSheet({
  isOpen,
  onClose,
  onTakePhoto,
  onUploadFromLibrary,
  onAddManually,
}: PhotoSourceSheetProps) {
  const choose = (action: () => void) => () => {
    onClose();
    setTimeout(action, DISMISS_ANIMATION_MS);
  };

  // useRNModal: by default the sheet renders in a portal at the app root, which sits
  // underneath the native `inventory` modal — so it would be invisible on those screens.
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} useRNModal>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <ActionsheetItem onPress={choose(onTakePhoto)} className="justify-center active:opacity-70">
          <ActionsheetItemText className="text-base font-semibold text-harvest-slate">
            Take Photo
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem
          onPress={choose(onUploadFromLibrary)}
          className="justify-center active:opacity-70">
          <ActionsheetItemText className="text-base font-semibold text-harvest-slate">
            Upload from Library
          </ActionsheetItemText>
        </ActionsheetItem>
        {onAddManually && (
          <ActionsheetItem onPress={choose(onAddManually)} className="justify-center active:opacity-70">
            <ActionsheetItemText className="text-base font-semibold text-harvest-slate">
              Add Manually
            </ActionsheetItemText>
          </ActionsheetItem>
        )}
        <ActionsheetItem onPress={onClose} className="justify-center active:opacity-70">
          <ActionsheetItemText className="text-base font-semibold text-destructive">
            Cancel
          </ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
}
