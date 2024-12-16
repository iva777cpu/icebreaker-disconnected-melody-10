import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X, Plus, LogOut, MessageSquare, User, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQuestions } from "../questions/useQuestions";

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearForm, setAnswers, setCurrentProfileName, setCurrentProfileId } = useQuestions();

  const { data: savedProfiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['saved-profiles'],
    queryFn: async () => {
      console.log('Fetching saved profiles');
      const { data, error } = await supabase
        .from('saved_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Fetched profiles:', data);
      return data || [];
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting profile:', id);
      const { error } = await supabase
        .from('saved_profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast.success("Profile deleted successfully");
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleNewProfile = () => {
    console.log('Creating new profile');
    clearForm(); // This will reset all state including currentProfileId
    setOpen(false);
    toast.success("Started a new profile");
  };

  const handleLoadProfile = async (profile: any) => {
    console.log('Loading profile:', profile);
    
    // First clear everything
    clearForm();
    
    // Then set the new profile data
    setCurrentProfileId(profile.id);
    setCurrentProfileName(profile.name);
    setAnswers(profile.answers || {});
    
    setOpen(false);
    toast.success("Profile loaded successfully");
  };

  const handleViewSavedResponses = () => {
    navigate("/saved-responses");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-[#EDEDDD]">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#1A2A1D] border-l-[#2D4531]/20">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-[#EDEDDD]">Menu</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-[#EDEDDD]">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <Button 
            variant="ghost" 
            onClick={handleNewProfile}
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#EDEDDD]">Saved Profiles</h3>
            <div className="space-y-2">
              {isLoadingProfiles ? (
                <div className="text-[#EDEDDD] text-sm">Loading profiles...</div>
              ) : savedProfiles?.map((profile) => (
                <div key={profile.id} className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleLoadProfile(profile)}
                    className="flex-1 justify-start text-[#EDEDDD] hover:bg-[#2D4531]/20"
                  >
                    <User className="mr-2 h-4 w-4" />
                    {profile.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProfileMutation.mutate(profile.id)}
                    className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleViewSavedResponses}
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            View Saved Responses
          </Button>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#2D4531]/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};