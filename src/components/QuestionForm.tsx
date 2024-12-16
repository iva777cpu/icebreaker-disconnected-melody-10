import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionCard } from "./questions/QuestionCard";
import { ResponseCard } from "./responses/ResponseCard";
import { questions, useQuestions } from "./questions/useQuestions";
import { FormControls } from "./questions/FormControls";
import { SaveProfileDialog } from "./questions/SaveProfileDialog";
import { ProfileHeader } from "./questions/ProfileHeader";
import { useProfileMutations } from "./questions/useProfileMutations";
import { useResponseMutations } from "./questions/useResponseMutations";

export const QuestionForm = () => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const {
    answers,
    aiResponses,
    isLoading,
    handleInputChange: baseHandleInputChange,
    generateResponses: baseGenerateResponses,
    clearForm,
    loadProfile,
    setAnswers,
    setAiResponses,
    currentProfileName,
    setCurrentProfileName,
    currentProfileId,
    setCurrentProfileId
  } = useQuestions();

  const { saveProfileMutation, updateProfileMutation, updateProfileNameMutation } = useProfileMutations();
  const { saveResponseMutation } = useResponseMutations();

  const handleInputChange = (id: string, value: string) => {
    baseHandleInputChange(id, value);
    setHasUnsavedChanges(true);
  };

  const generateResponses = () => {
    baseGenerateResponses(isFirstTime);
  };

  const handleNewProfile = () => {
    clearForm();
    setHasUnsavedChanges(false);
  };

  const handleSaveChanges = () => {
    if (currentProfileId) {
      updateProfileMutation.mutate({ profileId: currentProfileId, answers });
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveNewProfile = () => {
    setShowSaveDialog(true);
  };

  const handleSaveProfile = () => {
    saveProfileMutation.mutate(
      { profileName, answers },
      {
        onSuccess: () => {
          setShowSaveDialog(false);
          setProfileName("");
          setHasUnsavedChanges(false);
        },
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-6">
      <ProfileHeader
        profileName={currentProfileName}
        currentProfileId={currentProfileId}
        onNameChange={(newName) => {
          setCurrentProfileName(newName);
          if (currentProfileId) {
            updateProfileNameMutation.mutate({ profileId: currentProfileId, newName });
          }
        }}
      />

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

      <FormControls
        hasUnsavedChanges={hasUnsavedChanges}
        currentProfileId={currentProfileId}
        isLoading={isLoading}
        onSaveChanges={handleSaveChanges}
        onSaveNewProfile={handleSaveNewProfile}
        onGenerateResponses={generateResponses}
        onNewProfile={handleNewProfile}
      />

      {aiResponses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-medium text-center text-[#EDEDDD]">Generated Ice Breakers</h2>
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

      <SaveProfileDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        profileName={profileName}
        onProfileNameChange={setProfileName}
        onSave={handleSaveProfile}
      />
    </div>
  );
};