import React, { useRef, useEffect } from "react";
import { ChatMessage, Dataset } from "@/types/dataset";
import { ChatMessageComponent } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatAreaProps {
  messages: ChatMessage[];
  onDatasetView?: (dataset: Dataset) => void;
}

export function ChatArea({ messages, onDatasetView }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 h-full p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <ChatMessageComponent
            key={message.id}
            message={message}
            onDatasetView={onDatasetView}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
