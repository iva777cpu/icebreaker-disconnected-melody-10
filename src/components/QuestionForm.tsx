import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionCard } from "./questions/QuestionCard";
import { ResponseCard } from "./responses/ResponseCard";
import { questions, useQuestions } from "./questions/useQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const QuestionForm = () => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    answers,
    aiResponses,
    isLoading,
    handleInputChange: baseHandleInputChange,
    generateResponses: baseGenerateResponses,
    clearForm,
    setAnswers
  } = useQuestions();

  const handleInputChange = (id: string, value: string) => {
    baseHandleInputChange(id, value);
    setHasUnsavedChanges(true);
  };

  const generateResponses = () => {
    baseGenerateResponses(isFirstTime);
  };

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
      setHasUnsavedChanges(false);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_profiles')
        .update({ answers })
        .eq('id', profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-profiles'] });
      toast({
        title: "Changes Saved!",
        description: "Your profile changes have been saved successfully.",
      });
      setHasUnsavedChanges(false);
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

  const handleNewProfile = () => {
    clearForm();
    setCurrentProfileId(null);
    setHasUnsavedChanges(false);
    setAiResponses([]);
  };

  const handleSaveChanges = () => {
    if (currentProfileId) {
      updateProfileMutation.mutate(currentProfileId);
    }
  };

  const handleSaveNewProfile = () => {
    setShowSaveDialog(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="firstTime"
          checked={isFirstTime}
          onCheckedChange={(checked) => setIsFirstTime(checked as boolean)}
          className="border-[#EDEDDD]"
        />
        <label
          htmlFor="firstTime"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#EDEDDD]"
        >
          First time approaching this person?
        </label>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-4 text-[#EDEDDD]">About You</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {questions.userTraits.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                text={question.text}
                value={answers[question.id] || ""}
                onChange={handleInputChange}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4 text-[#EDEDDD]">About Them</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {questions.targetTraits.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                text={question.text}
                value={answers[question.id] || ""}
                onChange={handleInputChange}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {hasUnsavedChanges && currentProfileId && (
          <Button
            onClick={handleSaveChanges}
            className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
        {!currentProfileId && Object.keys(answers).some(key => answers[key]) && (
          <Button
            onClick={handleSaveNewProfile}
            className="bg-[#2D4531] hover:bg-[#2D4531]/90 text-[#EDEDDD]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
        )}
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
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-medium text-center text-[#EDEDDD]">Generated Ice Breakers</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={generateResponses}
              disabled={isLoading}
              className="text-[#EDEDDD] hover:bg-[#2D4531]/20"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
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