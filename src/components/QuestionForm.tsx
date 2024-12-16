import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Save } from "lucide-react";

interface Question {
  id: string;
  text: string;
  examples: string[];
}

const questions: Question[] = [
  {
    id: "feeling",
    text: "How's the other person feeling?",
    examples: ["Feeling down?", "On top of the world?", "A bit unsure?"]
  },
  {
    id: "situation",
    text: "What's the situation?",
    examples: ["Are you on a date?", "Enjoying a party?", "Out in the park?"]
  },
  // ... Add all other questions here with their examples
];

export const QuestionForm = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    toast({
      title: "Saved!",
      description: "Response has been saved to your collection.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {questions.map((question) => (
          <Card key={question.id} className="p-6 fade-in">
            <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
            <Input
              placeholder={question.examples.join(" | ")}
              className="mb-2"
              value={answers[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Examples: {question.examples.join(", ")}
            </p>
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