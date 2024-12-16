import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const questions = [
  { id: "feeling", text: "How's the other person feeling?" },
  { id: "situation", text: "What's the situation?" },
  { id: "comeAcross", text: "How would you like to come across?" },
  { id: "theirAge", text: "What's their age?" },
  { id: "yourAge", text: "What's your age?" },
  { id: "zodiac", text: "What's their zodiac sign?" },
  { id: "origin", text: "Where are they from?" },
  { id: "hobbies", text: "What are their hobbies?" },
  { id: "loves", text: "What do they love?" },
  { id: "dislikes", text: "What do they dislike?" },
  { id: "mbti", text: "What's their MBTI type?" },
  { id: "books", text: "What are their favorite books?" },
  { id: "music", text: "What's their favorite music?" },
  { id: "humor", text: "How would you describe their sense of humor?" },
  { id: "previousTopics", text: "What topics have you chatted about before?" },
  { id: "style", text: "What's their style?" },
  { id: "passions", text: "What are they passionate about?" },
  { id: "vibe", text: "What's their vibe like?" },
  { id: "preferredTopics", text: "What do you prefer to talk about?" }
];

export const useQuestions = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const clearForm = () => {
    setAnswers({});
    setAiResponses([]);
  };

  const generateResponses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ice-breakers', {
        body: { answers }
      });

      if (error) throw error;
      setAiResponses(data.iceBreakers);
    } catch (error) {
      console.error('Error generating responses:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    answers,
    aiResponses,
    isLoading,
    handleInputChange,
    generateResponses,
    clearForm
  };
};