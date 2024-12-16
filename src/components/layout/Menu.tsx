import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X, Plus, LogOut, MessageSquare, User, Pen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useQuestions } from "../questions/useQuestions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<{ id: string; name: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { clearForm, setAnswers } = useQuestions();

  const { data: savedProfiles } = useQuery({
    queryKey: ['saved-profiles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('saved_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('saved_profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast({
        title: "Profile Deleted",
        description: "The profile has been deleted successfully.",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from('saved_profiles')
        .update({ name })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      setEditingProfile(null);
      toast({
        title: "Profile Updated",
        description: "The profile name has been updated successfully.",
      });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleNewProfile = () => {
    clearForm();
    setOpen(false);
    toast({
      title: "New Profile",
      description: "Started a new profile.",
    });
  };

  const handleLoadProfile = async (profile: any) => {
    setAnswers(profile.answers);
    setOpen(false);
    toast({
      title: "Profile Loaded",
      description: "The profile has been loaded successfully.",
    });
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
              {savedProfiles?.map((profile) => (
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
                    onClick={() => setEditingProfile({ id: profile.id, name: profile.name })}
                    className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
                  >
                    <Pen className="h-4 w-4" />
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

      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent className="bg-[#1A2A1D] text-[#EDEDDD]">
          <DialogHeader>
            <DialogTitle>Edit Profile Name</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editingProfile?.name || ""}
              onChange={(e) => setEditingProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
              placeholder="Enter profile name"
              className="bg-[#2D4531]/10 border-[#2D4531]/20 text-[#EDEDDD]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditingProfile(null)}
              className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={() => editingProfile && updateProfileMutation.mutate(editingProfile)}
              className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};