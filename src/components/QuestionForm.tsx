import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, BookmarkPlus, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { QuestionCard } from "./questions/QuestionCard";
import { ResponseCard } from "./responses/ResponseCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const questions = [
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

export const QuestionForm = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_profiles')
        .insert({
          name: profileName,
          answers,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast({
        title: "Profile Saved!",
        description: "Your profile has been saved successfully.",
      });
      setShowSaveDialog(false);
      setProfileName("");
    },
  });

  const saveResponseMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_responses')
        .insert({
          text,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-responses'] });
      toast({
        title: "Saved!",
        description: "Response has been saved to your collection.",
      });
    },
  });

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const generateResponses = async () => {
    setIsLoading(true);
    try {
      // Here we'll integrate with OpenAI
      // For now, just mock responses
      const mockResponses = [
        "Hey! I noticed you seem really passionate about hiking. What's your favorite trail so far?",
        "I couldn't help but notice your enthusiasm for outdoor adventures. Got any exciting trips planned?",
        "Your love for nature really shows! What inspired you to start hiking?"
      ];
      setAiResponses(mockResponses);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate responses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowSaveDialog(true)}
          className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
        >
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Save Profile
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            id={question.id}
            text={question.text}
            value={answers[question.id] || ""}
            onChange={handleInputChange}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={generateResponses}
          disabled={isLoading}
          className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Generate Ice Breakers
        </Button>
      </div>

      {aiResponses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-center text-[#EDEDDD]">Generated Ice Breakers</h2>
          <div className="grid gap-3">
            {aiResponses.map((response, index) => (
              <ResponseCard
                key={index}
                response={response}
                onSave={(text) => saveResponseMutation.mutate(text)}
              />
            ))}
          </div>
        </div>
      )}

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-[#1A2A1D] text-[#EDEDDD]">
          <DialogHeader>
            <DialogTitle>Save Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter profile name"
              className="bg-[#2D4531]/10 border-[#2D4531]/20 text-[#EDEDDD]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowSaveDialog(false)}
              className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveProfileMutation.mutate()}
              className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
