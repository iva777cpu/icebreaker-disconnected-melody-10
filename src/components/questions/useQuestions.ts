import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const questions = {
  userTraits: [
    { id: "yourAge", text: "What's your age?", prompt: "Consider age appropriateness in conversation" },
    { id: "comeAcross", text: "How would you like to come across?", prompt: "Match this tone in responses" },
    { id: "preferredTopics", text: "What do you prefer to talk about?", prompt: "Include these topics when relevant" }
  ],
  targetTraits: [
    { id: "feeling", text: "How's the other person feeling?", prompt: "Consider their emotional state" },
    { id: "situation", text: "What's the situation?", prompt: "Factor in the context" },
    { id: "theirAge", text: "What's their age?", prompt: "Ensure age-appropriate conversation" },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Reference zodiac traits if mentioned" },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if relevant" },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use shared interests as conversation starters" },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively" },
    { id: "dislikes", text: "What do they dislike?", prompt: "Avoid these topics" },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality type in approach" },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests as topics" },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes when relevant" },
    { id: "humor", text: "How would you describe their sense of humor?", prompt: "Match their humor style" },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on previous conversations" },
    { id: "style", text: "What's their style?", prompt: "Note their aesthetic preferences" },
    { id: "passions", text: "What are they passionate about?", prompt: "Focus on their key interests" },
    { id: "vibe", text: "What's their vibe like?", prompt: "Match their energy level" }
  ]
};

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

  const generateResponses = async (isFirstTime: boolean = false) => {
    setIsLoading(true);
    try {
      // Filter out empty answers
      const filledAnswers = Object.entries(answers)
        .filter(([_, value]) => value && value.toString().trim() !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      // Get prompts for filled answers
      const filledPrompts = [...questions.userTraits, ...questions.targetTraits]
        .filter(q => filledAnswers[q.id])
        .reduce((acc, q) => ({ ...acc, [q.id]: { value: filledAnswers[q.id], prompt: q.prompt } }), {});

      const { data, error } = await supabase.functions.invoke('generate-ice-breakers', {
        body: { answers: filledPrompts, isFirstTime }
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
    clearForm,
    setAnswers
  };
};