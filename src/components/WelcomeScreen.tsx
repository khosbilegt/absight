import React from "react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  const suggestedQueries = [
    "Find youth employment data",
    "Regional development statistics",
    "Health outcomes by postcode",
    "Education completion rates",
  ];

  return (
    <div className="text-center mb-8 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
          Discover Australia&apos;s Data
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed">
          Find government datasets using natural language. Ask about employment,
          health, education, or any topic you&apos;re researching.
        </p>
      </div>

      {/* Suggested Queries */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {suggestedQueries.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion)}
            className="text-sm bg-background/50 hover:bg-accent hover:text-accent-foreground border-border/50 backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
