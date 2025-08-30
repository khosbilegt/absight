import React, { useState } from "react";
import { Dataset, ChatMessage } from "@/types/dataset";
import { WelcomeScreen } from "./WelcomeScreen";
import { ChatArea } from "./ChatArea";
import { SearchInput } from "./SearchInput";
import { useRecentSearches } from "@/providers/recent-searches-provider";

// Mock backend response for development
const mockApiResponse = {
  answer:
    "Based on the data provided, the available dataset for labour force statistics is:\n\n**6202.0 Labour Force, Australia - Table 25. Underutilised persons by State, Territory and Sex (expanded analytical series), Monthly**\n\nThis dataset contains detailed monthly time series data covering:\n\n**Geographic coverage:** Australia and all states/territories (NSW, Victoria, Queensland, South Australia, Western Australia, Tasmania, Northern Territory, Australian Capital Territory)\n\n**Breakdowns available:**\n- By sex (Persons, Males, Females)\n- Employment status (Employed total, Employed full-time, Employed part-time)\n- Underemployment categories (expanded analytical series) including:\n  - Underemployed total\n  - Underemployed full-time (with sub-categories for economic reasons and preference for more hours)\n  - Underemployed part-time (with sub-categories for economic reasons and preference for more hours)\n\n**Time coverage:** Monthly data from July 2014 through to July 2025 (133 observations per series)\n\n**Data characteristics:**\n- Original series type\n- Stock data type\n- Monthly frequency\n- Units in thousands (000)\n\nThis dataset provides comprehensive labour force underutilisation statistics that can be analyzed by jurisdiction, sex, and employment type over an 11-year period.",
  datasets: [
    {
      agency: "Australian Bureau of Statistics",
      title:
        "6202.0 Labour Force, Australia - Table 25. Underutilised persons by State, Territory and Sex (expanded analytical series), Monthly",
      topics: ["labour", "employment", "underutilisation", "australia"],
      url: "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia",
      downloadUrl:
        "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia/latest-release/6202025.xlsx",
    },
  ],
};

export default function DataDiscoveryChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addRecentSearch } = useRecentSearches();
  const hasMessages = messages.length > 0;

  // Simulate HTTP request to backend for dataset search
  const searchDatasets = async (
    query: string
  ): Promise<{ answer: string; datasets: Dataset[] }> => {
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: query }),
      });
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      // Optionally add qualityScore if not present
      return {
        answer: data.answer,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        datasets: (data.datasets || []).map((item: any) => ({
          ...item,
          qualityScore:
            item.qualityScore ?? Math.floor(Math.random() * 41) + 60,
        })),
      };
    } catch (e) {
      // fallback to mock data on error
      return {
        ...mockApiResponse,
        datasets: mockApiResponse.datasets.map((item) => ({
          ...item,
          qualityScore: Math.floor(Math.random() * 41) + 60,
        })),
      };
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const { answer, datasets } = await searchDatasets(trimmedInput);
    addRecentSearch(trimmedInput, answer, datasets);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: answer,
      datasets,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleDatasetView = (dataset: Dataset) => {
    window.open(dataset.url, "_blank");
  };

  if (!hasMessages) {
    // Welcome State - Input in Center
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />

          <div className="w-full max-w-2xl">
            <SearchInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder="Search for government datasets... e.g., What datasets are available for labor force statistics?'"
              size="large"
            />
          </div>
        </div>
      </div>
    );
  }

  // Chat Mode - Messages with Fixed Bottom Input
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      {/* Chat Messages Area - Takes remaining space minus input area */}
      <div className="flex-1 min-h-0 flex flex-col">
        <ChatArea messages={messages} onDatasetView={handleDatasetView} />
      </div>

      {/* Fixed Bottom Input */}
      <div className="shrink-0 border-t border-border bg-background/90 backdrop-blur-sm p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <SearchInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            placeholder="Ask about datasets... e.g., 'Find employment data for regional areas'"
            size="normal"
          />
        </div>
      </div>
    </div>
  );
}
