// ===== FILE: src/components/chat/ChatWindow.tsx =====

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Message as MessageType, Chat } from "@/lib/types";
import { useChatHistory } from "@/hooks/use-chat-history";
import { WelcomeScreen } from "./WelcomeScreen";
import { Message } from "./Message";
import { PromptInput } from "./PromptInput";
import { SkeletonLoader } from "../ui/SkeletonLoader";
import { toast } from "sonner";

// شبیه‌سازی یک تابع برای دریافت پاسخ از AI
async function getAIResponse(prompt: string): Promise<MessageType> {
  await new Promise(resolve => setTimeout(resolve, 1500)); // تاخیر برای شبیه‌سازی

  // پاسخ ساختگی
  if (prompt.includes("محصول")) {
    return {
      id: crypto.randomUUID(),
      role: 'ai',
      content: 'پاسخ ساختاریافته برای محصول',
      structuredContent: {
        title: 'معرفی محصول جدید: گجت شگفت‌انگیز',
        script: `
### صحنه ۱: آنباکسینگ
- **تصویر**: نمای نزدیک از جعبه محصول.
- **صدا**: موسیقی هیجان‌انگیز.
- **متن روی ویدیو**: "بالاخره رسید!"

### صحنه ۲: نمایش قابلیت اصلی
- **تصویر**: استفاده از قابلیت اصلی محصول.
- **صدا**: صدای "واو" یا افکت صوتی جذاب.
- **متن روی ویدیو**: "زندگی رو ساده‌تر می‌کنه!"
        `,
        caption: "گجت جدیدمون رو دیدی؟ 🤩 با این وسیله دیگه نگران [مشکل] نباش! لینک خرید در بایو. #تکنولوژی #گجت #محصول_جدید"
      }
    };
  }
  
  return {
    id: crypto.randomUUID(),
    role: "ai",
    content: `این یک پاسخ شبیه‌سازی شده برای "${prompt}" است. شما می‌توانید این منطق را با API واقعی خود جایگزین کنید.`
  };
}

interface ChatWindowProps {
  initialChat?: Chat;
}

// FIX: Make sure the component is exported as default
export default function ChatWindow({ initialChat }: ChatWindowProps) {
  const router = useRouter();
  const { addChat, updateChat } = useChatHistory();
  const [messages, setMessages] = useState<MessageType[]>(initialChat?.messages || []);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChat) {
      setMessages(initialChat.messages);
    } else {
      setMessages([]);
    }
  }, [initialChat]);

  useEffect(() => {
    // اسکرول به پایین با هر پیام جدید
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const mutation = useMutation({
    mutationFn: getAIResponse,
    onSuccess: (aiMessage) => {
      const currentMessages = [...messages, aiMessage];
      setMessages(currentMessages);
      
      const userMessage = messages[messages.length - 1];
      if (!userMessage || userMessage.role !== 'user') return;

      if (initialChat) {
        // آپدیت چت موجود
        const updatedChat = { ...initialChat, messages: currentMessages };
        updateChat(updatedChat);
      } else {
        // ایجاد چت جدید
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: userMessage.content.substring(0, 40), // Truncate title
          messages: currentMessages,
          createdAt: new Date(),
        };
        addChat(newChat);
        router.push(`/chat/${newChat.id}`);
      }
    },
    onError: (error) => {
      console.error("AI response error:", error);
      toast.error("خطا در دریافت پاسخ از سرور.");
      setMessages(prev => prev.slice(0, -1));
    },
  });

  const handlePromptSubmit = (prompt: string) => {
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };
    setMessages((prev) => [...prev, userMessage]);
    mutation.mutate(prompt);
  };
  
  const handleExamplePromptClick = (prompt: string) => {
      handlePromptSubmit(prompt);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {mutation.isPending && <SkeletonLoader />}
          </div>
        ) : (
          <WelcomeScreen onExamplePromptClick={handleExamplePromptClick}/>
        )}
      </div>
      <PromptInput
        onSubmit={handlePromptSubmit}
        isLoading={mutation.isPending}
      />
    </div>
  );
}