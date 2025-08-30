"use client";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [inputAtBottom, setInputAtBottom] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) setInputAtBottom(true);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "This is a sample response." },
      ]);
    }, 800);
  };

  return (
    <section className="flex flex-col flex-1 h-full w-full items-center justify-center relative overflow-hidden">
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col justify-end px-4 py-8 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60 select-none">
            <span className="text-5xl mb-4">💬</span>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Start a new chat
            </h2>
            <p className="text-slate-500">Type your message below to begin.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-8">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-xl px-5 py-3 max-w-[80%] text-base shadow-md ${
                  msg.role === "user"
                    ? "self-end bg-blue-600 text-white"
                    : "self-start bg-slate-200 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>
      <Separator className="w-full" />
      <form
        className={`absolute left-0 w-full flex justify-center bg-gradient-to-t from-white/90 via-white/60 to-transparent px-4 py-6 transition-all duration-300 ${
          inputAtBottom || messages.length > 0
            ? "bottom-0"
            : "top-1/2 -translate-y-1/2"
        }`}
        style={{ maxWidth: "100vw" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <Input
          type="text"
          className="w-full max-w-2xl text-lg"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          className="ml-3 px-6 py-3 text-lg"
          disabled={!input.trim()}
        >
          Send
        </Button>
      </form>
    </section>
  );
}
