// ===== FILE: src/components/chat/ChatWindow.tsx =====
// FINAL, DEFINITIVE, AND SIMPLIFIED FIX for all bugs.
// This version uses a straightforward state management pattern.

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Message as MessageType, Chat } from "@/lib/types";
import { useChatHistory } from "@/hooks/use-chat-history";
import { WelcomeScreen } from "./WelcomeScreen";
import { Message } from "./Message";
import { PromptInput } from "./PromptInput";
import { SkeletonLoader } from "../ui/SkeletonLoader";
import { toast } from "sonner";

// AI Response simulation remains the same
async function getAIResponse(prompt: string): Promise<MessageType> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (prompt.includes("محصول")) {
    return {
      id: crypto.randomUUID(),
      role: 'ai',
      content: 'پاسخ ساختاریافته برای محصول شما',
      structuredContent: {
        title: 'معرفی محصول جدید: گجت انقلابی',
        script: `### صحنه ۱: آنباکسینگ\n- **تصویر**: نمای نزدیک از جعبه محصول با نورپردازی دراماتیک.\n- **صدا**: موسیقی هیجان‌انگیز.\n- **متن روی ویدیو**: "آینده از اینجا شروع می‌شه!"`,
        caption: "بالاخره رسید! گجت جدید فراز که قواعد بازی رو عوض می‌کنه. برای همیشه با [مشکل] خداحافظی کنید. لینک در بایو! #فراز #تکنولوژی #محصول_جدید"
      }
    };
  }
  return { id: crypto.randomUUID(), role: "ai", content: `این یک پاسخ شبیه‌سازی شده برای "${prompt}" است.` };
}

interface ChatWindowProps {
  initialChat?: Chat;
}

export default function ChatWindow({ initialChat }: ChatWindowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { addChat, updateChat } = useChatHistory();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // This ref will hold the latest user message to avoid stale state issues.
  const latestUserMessage = useRef<MessageType | null>(null);

  useEffect(() => {
    setMessages(initialChat?.messages || []);
  }, [initialChat]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const mutation = useMutation({
    mutationFn: getAIResponse,
    onSuccess: (aiMessage) => {
      // Create the final, complete list of messages for this turn.
      const finalMessages = [...messages, aiMessage];
      setMessages(finalMessages);

      if (pathname.includes('/chat/')) {
        // We are in an existing chat. Update it.
        if (initialChat) {
          updateChat({ ...initialChat, messages: finalMessages });
        }
      } else {
        // This was a new chat. We need to create it now with the full conversation.
        const newChatId = crypto.randomUUID();
        addChat({
          id: newChatId,
          title: latestUserMessage.current?.content.substring(0, 40) + '...' || 'چت جدید',
          messages: finalMessages,
          createdAt: new Date(),
        });
        // Use replace to avoid polluting browser history
        router.replace(`/chat/${newChatId}`, { scroll: false });
      }
    },
    onError: () => {
      toast.error("خطا در دریافت پاسخ از سرور.");
      // Rollback: remove the user message that was optimistically added.
      setMessages(prev => prev.filter(msg => msg.id !== latestUserMessage.current?.id));
    },
  });

  const handleSubmit = (prompt: string) => {
    if (mutation.isPending || !prompt.trim()) return;

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    
    // Store the latest user message in a ref to access it reliably in onSuccess/onError.
    latestUserMessage.current = userMessage;

    // Optimistically update the UI.
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Trigger the mutation. The logic is now handled in onSuccess.
    mutation.mutate(prompt);
  };
  
  const handleEdit = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
      const messagesWithoutLastPair = messages.slice(0, -2);
      setMessages(messagesWithoutLastPair);
      if (initialChat) {
        updateChat({ ...initialChat, messages: messagesWithoutLastPair });
      }
      toast.info("پیام شما برای ویرایش آماده شد.");
    }
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      const messagesWithoutLastAi = messages.slice(0, -1);
      setMessages(messagesWithoutLastAi);
      if (initialChat) {
        updateChat({ ...initialChat, messages: messagesWithoutLastAi });
      }
      handleSubmit(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="p-2 md:p-4 space-y-4">
            {messages.map((msg, index) => (
              <Message 
                key={`${msg.id}-${index}`}
                message={msg}
                onEdit={handleEdit}
                onRegenerate={handleRegenerate}
              />
            ))}
            {mutation.isPending && <SkeletonLoader />}
          </div>
        ) : (
          <WelcomeScreen onExamplePromptClick={handleSubmit}/>
        )}
      </div>
      <PromptInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />
    </div>
  );
}