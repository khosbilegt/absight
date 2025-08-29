import React, { useState } from "react";
import { Send, Sparkles, Lightbulb } from "lucide-react";

interface GenerateModeProps {
  onComplete: (
    question: string,
    chartData: { name: string; value: number }[],
    chartType: "bar" | "line" | "area" | "pie"
  ) => void;
}

const GenerateMode: React.FC<GenerateModeProps> = ({ onComplete }) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Generate dummy data based on the question
      const generateDummyData = () => {
        const categories = ["Q1", "Q2", "Q3", "Q4", "Q5"];
        return categories.map((cat) => ({
          name: cat,
          value: Math.floor(Math.random() * 1000) + 100,
        }));
      };

      // Determine chart type based on question keywords
      let chartType: "bar" | "line" | "area" | "pie" = "bar";
      const questionLower = question.toLowerCase();

      if (
        questionLower.includes("trend") ||
        questionLower.includes("time") ||
        questionLower.includes("over time") ||
        questionLower.includes("timeline")
      ) {
        chartType = "line";
      } else if (
        questionLower.includes("distribution") ||
        questionLower.includes("percentage") ||
        questionLower.includes("share") ||
        questionLower.includes("proportion")
      ) {
        chartType = "pie";
      } else if (
        questionLower.includes("area") ||
        questionLower.includes("filled") ||
        questionLower.includes("volume")
      ) {
        chartType = "area";
      }

      onComplete(question.trim(), generateDummyData(), chartType);
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleClick = (sample: string) => {
    setQuestion(sample);
  };

  const sampleQuestions = [
    "Show quarterly sales trends for this year",
    "Display user engagement by platform",
    "Compare revenue across different regions",
    "Show conversion rates over time",
    "Analyze product category performance",
    "Track monthly active users growth",
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          AI Chart Generator
        </h3>
        <p className="text-slate-500 leading-relaxed">
          Describe what you want to visualize and AI will create the perfect
          chart for your data
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            What would you like to visualize?
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Show quarterly sales trends for the last year..."
            className="w-full p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white shadow-sm"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-center mb-6">
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Chart...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-3" />
                Generate Chart
              </>
            )}
          </button>
        </div>

        {/* Sample Questions */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">
              Try these examples:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleQuestions.map((sample, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSampleClick(sample)}
                className="text-left p-3 text-sm text-slate-600 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
                disabled={isLoading}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default GenerateMode;
