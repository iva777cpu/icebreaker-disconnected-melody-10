import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SaveProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileName: string;
  onProfileNameChange: (name: string) => void;
  onSave: () => void;
}

export const SaveProfileDialog = ({
  open,
  onOpenChange,
  profileName,
  onProfileNameChange,
  onSave
}: SaveProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A2A1D] text-[#EDEDDD]">
        <DialogHeader>
          <DialogTitle>Save Profile</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={profileName}
            onChange={(e) => onProfileNameChange(e.target.value)}
            placeholder="Enter profile name"
            className="bg-[#2D4531]/10 border-[#2D4531]/20 text-[#EDEDDD]"
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};