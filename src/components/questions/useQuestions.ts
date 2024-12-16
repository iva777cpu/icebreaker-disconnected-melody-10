import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const questions = {
  userTraits: [
    { id: "yourGender", text: "What's your gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "yourAge", text: "What's your age?", prompt: "Consider age appropriateness in conversation", temperature: 0.5 },
    { id: "comeAcross", text: "How would you like to come across?", prompt: "Match this tone in responses", temperature: 0.8 },
    { id: "preferredTopics", text: "What do you prefer to talk about?", prompt: "Include these topics when relevant", temperature: 0.8 }
  ],
  targetTraits: [
    { id: "theirGender", text: "What's their gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "feeling", text: "How's the other person feeling?", prompt: "Consider their emotional state", temperature: 0.5 },
    { id: "situation", text: "What's the situation?", prompt: "Factor in the context", temperature: 0.5 },
    { id: "theirAge", text: "What's their age?", prompt: "Ensure age-appropriate conversation", temperature: 0.5 },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Reference zodiac traits if mentioned", temperature: 0.5 },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if relevant", temperature: 0.5 },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use shared interests as conversation starters", temperature: 0.5 },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively", temperature: 0.5 },
    { id: "dislikes", text: "What do they dislike?", prompt: "Avoid these topics", temperature: 0.5 },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality type in approach", temperature: 0.5 },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests as topics", temperature: 0.5 },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes when relevant", temperature: 0.5 },
    { id: "humor", text: "How would you describe their sense of humor?", prompt: "Match their humor style", temperature: 0.5 },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on previous conversations", temperature: 0.8 },
    { id: "style", text: "What's their style?", prompt: "Note their aesthetic preferences", temperature: 0.2 },
    { id: "vibe", text: "What's their vibe like?", prompt: "Match their energy level", temperature: 0.2 }
  ]
};

interface ProfileAnswers {
  [key: string]: string;
}

export const useQuestions = () => {
  const [answers, setAnswers] = useState<ProfileAnswers>({});
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfileName, setCurrentProfileName] = useState("");
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  // Reset state when currentProfileId changes
  useEffect(() => {
    const loadProfile = async () => {
      console.log('Profile ID changed:', currentProfileId);
      
      if (!currentProfileId) {
        console.log('No profile ID - clearing state');
        setAnswers({});
        setAiResponses([]);
        setCurrentProfileName("");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('saved_profiles')
          .select('*')
          .eq('id', currentProfileId)
          .single();

        if (error) {
          console.error('Error loading profile:', error);
          throw error;
        }

        if (profile) {
          console.log('Loading profile data:', profile);
          const typedAnswers: ProfileAnswers = profile.answers as ProfileAnswers || {};
          setAnswers(typedAnswers);
          setCurrentProfileName(profile.name);
        }
      } catch (error) {
        console.error('Error in loadProfile:', error);
      }
    };

    loadProfile();
  }, [currentProfileId]);

  const handleInputChange = (id: string, value: string) => {
    console.log('Input change:', { id, value });
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const generateResponses = async (isFirstTime: boolean = false) => {
    console.log('Generating responses:', { answers, isFirstTime });
    setIsLoading(true);

    try {
      const filledAnswers = Object.entries(answers)
        .filter(([_, value]) => value && value.toString().trim() !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const filledPrompts = [...questions.userTraits, ...questions.targetTraits]
        .filter(q => filledAnswers[q.id])
        .reduce((acc, q) => ({
          ...acc,
          [q.id]: {
            value: filledAnswers[q.id],
            prompt: q.prompt,
            temperature: q.temperature
          }
        }), {});

      const { data, error } = await supabase.functions.invoke('generate-ice-breakers', {
        body: { answers: filledPrompts, isFirstTime }
      });

      if (error) throw error;
      
      console.log('Generated responses:', data.iceBreakers);
      setAiResponses(data.iceBreakers);
    } catch (error) {
      console.error('Error generating responses:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = useCallback(() => {
    console.log('Clearing form state');
    setAnswers({});
    setAiResponses([]);
    setCurrentProfileId(null);
    setCurrentProfileName("");
  }, []);

  return {
    answers,
    aiResponses,
    isLoading,
    handleInputChange,
    generateResponses,
    clearForm,
    setAnswers,
    setAiResponses,
    currentProfileName,
    setCurrentProfileName,
    currentProfileId,
    setCurrentProfileId
  };
};