import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponseCard } from "@/components/responses/ResponseCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedResponses = () => {
  const navigate = useNavigate();
  
  const { data: savedResponses } = useQuery({
    queryKey: ['saved-responses'],
    queryFn: async () => {
      const { data } = await supabase
        .from('saved_responses')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-[#303D24] p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-[#EDEDDD]">Saved Responses</h1>
        
        <div className="space-y-4">
          {savedResponses?.map((response) => (
            <ResponseCard
              key={response.id}
              response={response.text}
              onSave={() => {}}
              showSaveButton={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedResponses;