import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";
import { QuestionForm } from "@/components/QuestionForm";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1a2a1d] flex items-center justify-center px-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2a1d]">
      <Header />
      <main className="py-6">
        <QuestionForm />
      </main>
    </div>
  );
};

export default Index;