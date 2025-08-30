import React from "react";
import { ChatMessage, Dataset } from "@/types/dataset";
import { DatasetGrid } from "./DatasetGrid";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: ChatMessage;
  onDatasetView?: (dataset: Dataset) => void;
}

export function ChatMessageComponent({
  message,
  onDatasetView,
}: ChatMessageProps) {
  return (
    <div className="space-y-4">
      {/* User Message */}
      {message.type === "user" && (
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-xl shadow-sm">
            <p className="text-sm font-medium">{message.content}</p>
          </div>
        </div>
      )}

      {/* Assistant Message */}
      {message.type === "assistant" && (
        <div className="flex justify-start">
          <div className="space-y-4 max-w-full">
            {/* Assistant response bubble */}
            <div className="text-sm bg-card text-card-foreground rounded-2xl px-4 py-3 shadow-sm border border-border">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>

            {message.datasets && message.datasets.length > 0 && (
              <DatasetGrid
                datasets={message.datasets}
                onDatasetView={onDatasetView}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
