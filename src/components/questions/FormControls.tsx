import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Plus } from "lucide-react";

interface FormControlsProps {
  hasUnsavedChanges: boolean;
  currentProfileId: string | null;
  isLoading: boolean;
  onSaveChanges: () => void;
  onSaveNewProfile: () => void;
  onGenerateResponses: () => void;
}

export const FormControls = ({
  hasUnsavedChanges,
  currentProfileId,
  isLoading,
  onSaveChanges,
  onSaveNewProfile,
  onGenerateResponses
}: FormControlsProps) => {
  return (
    <div className="flex justify-center gap-4">
      {hasUnsavedChanges && currentProfileId && (
        <Button
          onClick={onSaveChanges}
          className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      )}
      {!currentProfileId && (
        <Button
          onClick={onSaveNewProfile}
          className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Save Profile
        </Button>
      )}
      <Button
        onClick={onGenerateResponses}
        disabled={isLoading}
        className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
      >
        {isLoading ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Generate Ice Breakers
      </Button>
    </div>
  );
};