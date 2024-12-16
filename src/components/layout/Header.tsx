import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="py-6 bg-[#2D4531]/10">
      <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#EDEDDD]">AI Ice Breaker Generator</h1>
        <Button variant="ghost" onClick={handleLogout} className="text-[#EDEDDD] hover:bg-[#2D4531]/20">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};