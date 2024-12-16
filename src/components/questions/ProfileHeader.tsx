import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Check, X } from "lucide-react";

interface ProfileHeaderProps {
  profileName: string;
  currentProfileId: string | null;
  onNameChange: (newName: string) => void;
}

export const ProfileHeader = ({ profileName, currentProfileId, onNameChange }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profileName);

  const handleSave = () => {
    onNameChange(editedName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(profileName);
    setIsEditing(false);
  };

  if (!currentProfileId) return null;

  return (
    <div className="flex items-center gap-2 mb-6">
      {isEditing ? (
        <>
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="max-w-[200px] bg-[#2D4531]/10 border-[#2D4531]/20 text-[#EDEDDD]"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-[#EDEDDD]">{profileName}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <Pen className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};