import { QuestionForm } from "@/components/QuestionForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-8 bg-primary/5">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-primary">AI Ice Breaker Generator</h1>
          <p className="text-muted-foreground mt-2">
            Fill in what you know, and let AI help you break the ice perfectly
          </p>
        </div>
      </header>
      <main className="py-8">
        <QuestionForm />
      </main>
    </div>
  );
};

export default Index;