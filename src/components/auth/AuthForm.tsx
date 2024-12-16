import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthForm = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-[#2D4531] rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-[#EDEDDD] mb-6 text-center">Welcome</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2D4531',
                brandAccent: '#435E47',
                inputBackground: '#1a2a1d',
                inputText: '#EDEDDD',
                inputPlaceholder: '#8F8F8F',
              },
            },
          },
        }}
        providers={[]}
      />
    </div>
  );
};