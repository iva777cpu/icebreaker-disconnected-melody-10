import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Save, Edit2, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Question {
  id: string;
  text: string;
}

const questions: Question[] = [
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

interface SavedProfile {
  id: string;
  name: string;
  answers: Record<string, string>;
}

interface SavedResponse {
  id: string;
  text: string;
  timestamp: number;
}

export const QuestionForm = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [profileName, setProfileName] = useState("New Profile");
  const { toast } = useToast();

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

  const saveResponse = (response: string) => {
    const newResponse = {
      id: Date.now().toString(),
      text: response,
      timestamp: Date.now()
    };
    setSavedResponses(prev => [newResponse, ...prev]);
    toast({
      title: "Saved!",
      description: "Response has been saved to your collection.",
    });
  };

  const saveProfile = () => {
    const newProfile = {
      id: Date.now().toString(),
      name: profileName,
      answers: { ...answers }
    };
    setSavedProfiles(prev => [newProfile, ...prev]);
    toast({
      title: "Profile Saved!",
      description: "Your profile has been saved successfully.",
    });
  };

  const loadProfile = (profile: SavedProfile) => {
    setAnswers(profile.answers);
    setProfileName(profile.name);
    toast({
      title: "Profile Loaded",
      description: "Profile data has been loaded into the form.",
    });
  };

  const deleteProfile = (id: string) => {
    setSavedProfiles(prev => prev.filter(profile => profile.id !== id));
    toast({
      title: "Profile Deleted",
      description: "The profile has been removed.",
    });
  };

  const deleteResponse = (id: string) => {
    setSavedResponses(prev => prev.filter(response => response.id !== id));
    toast({
      title: "Response Deleted",
      description: "The saved response has been removed.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="max-w-xs"
            placeholder="Profile Name"
          />
        </div>
        <div className="space-x-4">
          <Button onClick={saveProfile} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">View Saved</Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] bg-card">
              <SheetHeader>
                <SheetTitle>Saved Profiles & Responses</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Saved Profiles</h3>
                  <div className="space-y-4">
                    {savedProfiles.map((profile) => (
                      <Card key={profile.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{profile.name}</span>
                          <div className="space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => loadProfile(profile)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteProfile(profile.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Saved Responses</h3>
                  <div className="space-y-4">
                    {savedResponses.map((response) => (
                      <Card key={response.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <p className="flex-1">{response.text}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteResponse(response.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {questions.map((question) => (
          <Card key={question.id} className="p-6 fade-in">
            <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
            <Input
              placeholder="Type your answer here..."
              className="mb-2"
              value={answers[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={generateResponses}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
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
          <h2 className="text-xl font-semibold text-center">Generated Ice Breakers</h2>
          <div className="grid gap-4">
            {aiResponses.map((response, index) => (
              <Card key={index} className="p-4 fade-in">
                <div className="flex justify-between items-start">
                  <p className="flex-1">{response}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => saveResponse(response)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};