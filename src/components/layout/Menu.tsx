import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X, Plus, LogOut, Save, MessageSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useQuestions } from "../questions/useQuestions";

export const Menu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearForm } = useQuestions();

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
                <Button
                  key={profile.id}
                  variant="ghost"
                  className="w-full justify-start text-[#EDEDDD] hover:bg-[#2D4531]/20"
                >
                  <User className="mr-2 h-4 w-4" />
                  {profile.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#EDEDDD]">Saved Responses</h3>
            <div className="space-y-2">
              {savedResponses?.map((response) => (
                <Button
                  key={response.id}
                  variant="ghost"
                  className="w-full justify-start text-[#EDEDDD] hover:bg-[#2D4531]/20 h-auto"
                >
                  <MessageSquare className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate text-left">{response.text}</span>
                </Button>
              ))}
            </div>
          </div>

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