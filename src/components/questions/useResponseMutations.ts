import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useResponseMutations = () => {
  const queryClient = useQueryClient();

  const saveResponseMutation = useMutation({
    mutationFn: async (text: string) => {
      console.log('Saving response:', text);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_responses')
        .insert({
          text,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-responses'] });
      toast("Saved!", {
        description: "Response has been saved to your collection.",
      });
    },
  });

  return { saveResponseMutation };
};