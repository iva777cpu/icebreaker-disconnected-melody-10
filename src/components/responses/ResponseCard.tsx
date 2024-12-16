import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";

interface ResponseCardProps {
  response: string;
  onSave: (response: string) => void;
}

export const ResponseCard = ({ response, onSave }: ResponseCardProps) => {
  return (
    <Card className="p-4 bg-[#1A2A1D] border-[#2D4531]/20">
      <div className="flex justify-between items-start gap-4">
        <p className="flex-1 text-sm text-[#EDEDDD]">{response}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSave(response)}
          className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
        >
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};