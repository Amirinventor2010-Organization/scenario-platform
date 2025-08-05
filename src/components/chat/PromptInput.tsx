// ===== FILE: src/components/chat/PromptInput.tsx =====
// This is the clean, correct version without any extra text.

"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

interface PromptInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ input, setInput, onSubmit, isLoading }: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
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
      className="sticky bottom-0 bg-background/80 backdrop-blur-md p-2 md:p-4 border-t"
    >
      <div className="relative flex items-center max-w-3xl mx-auto">
        <TextareaAutosize
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام خود را اینجا بنویسید..."
          className="w-full resize-none rounded-full border border-input bg-background py-2 pl-10 pr-4 md:py-3 md:pl-12 md:pr-4 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          minRows={1}
          maxRows={5}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute left-1.5 md:left-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 md:w-9 md:h-9"
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-4 h-4 md:w-5 md:w-5" />
        </Button>
      </div>
    </form>
  );
}