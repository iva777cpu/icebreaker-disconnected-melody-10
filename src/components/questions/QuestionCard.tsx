import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface QuestionCardProps {
  id: string;
  text: string;
  value: string;
  onChange: (id: string, value: string) => void;
}

export const QuestionCard = ({ id, text, value, onChange }: QuestionCardProps) => {
  return (
    <Card className="p-4 bg-[#2D4531]/10 border-[#2D4531]/20">
      <h3 className="text-sm font-medium mb-3 text-[#EDEDDD]">{text}</h3>
      <Input
        placeholder="Type your answer here..."
        className="text-sm bg-[#2D4531]/5 border-[#2D4531]/20 text-[#EDEDDD] placeholder:text-[#EDEDDD]/50"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </Card>
  );
};