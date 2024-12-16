import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const AuthForm = () => {
  const { toast } = useToast();

  // Listen for auth errors
  useEffect(() => {
    const handleAuthError = (event: any) => {
      if (event.detail?.error?.message?.includes('User already registered')) {
        toast({
          title: "Account already exists",
          description: "Please sign in instead of creating a new account.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('supabase.auth.error', handleAuthError);
    return () => window.removeEventListener('supabase.auth.error', handleAuthError);
  }, [toast]);

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
                messageText: '#EDEDDD',
                anchorTextColor: '#EDEDDD',
                dividerBackground: '#435E47',
              },
            },
          },
          className: {
            message: 'text-[#EDEDDD]',
            anchor: 'text-[#EDEDDD] hover:text-[#EDEDDD]/80',
          },
        }}
        providers={[]}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up...',
              social_provider_text: 'Sign up with {{provider}}',
              link_text: 'Don\'t have an account? Sign up',
              confirmation_text: 'Check your email for the confirmation link',
            },
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: 'Already have an account? Sign in',
            },
          },
        }}
      />
    </div>
  );
};