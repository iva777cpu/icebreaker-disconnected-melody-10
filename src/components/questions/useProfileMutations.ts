import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  const saveProfileMutation = useMutation({
    mutationFn: async ({ profileName, answers }: { profileName: string; answers: any }) => {
      console.log('Saving new profile:', { profileName, answers });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_profiles')
        .insert({
          name: profileName,
          answers,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast("Profile Saved!", {
        description: "Your profile has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error saving profile:', error);
      toast("Error", {
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ profileId, answers }: { profileId: string; answers: any }) => {
      console.log('Updating profile:', { profileId, answers });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_profiles')
        .update({ answers })
        .eq('id', profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast("Changes Saved!", {
        description: "Your profile changes have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast("Error", {
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateProfileNameMutation = useMutation({
    mutationFn: async ({ profileId, newName }: { profileId: string; newName: string }) => {
      console.log('Updating profile name:', { profileId, newName });
      const { error } = await supabase
        .from('saved_profiles')
        .update({ name: newName })
        .eq('id', profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast("Profile Updated", {
        description: "Profile name has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile name:', error);
      toast("Error", {
        description: "Failed to update profile name. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    saveProfileMutation,
    updateProfileMutation,
    updateProfileNameMutation
  };
};