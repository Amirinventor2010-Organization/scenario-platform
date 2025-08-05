// components/chat/PromptInput.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 bg-background/80 backdrop-blur-md p-4 border-t"
    >
      <div className="relative flex items-center max-w-3xl mx-auto">
        <TextareaAutosize
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را اینجا بنویسید..."
          className="w-full resize-none rounded-full border border-input bg-background py-3 pl-12 pr-4 shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          minRows={1}
          maxRows={5}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
          disabled={isLoading || !prompt.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}