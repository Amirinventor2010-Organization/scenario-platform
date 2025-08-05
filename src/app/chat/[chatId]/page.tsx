// ===== FILE: src/app/chat/[chatId]/page.tsx =====

"use client";

// FIX: Importing a default export does not use curly braces {}
import ChatWindow from "@/components/chat/ChatWindow";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useEffect, useState } from "react";
import { Chat } from "@/lib/types";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { getChatById, isLoading } = useChatHistory();
  const [chat, setChat] = useState<Chat | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      const foundChat = getChatById(params.chatId);
      setChat(foundChat);
    }
  }, [params.chatId, getChatById, isLoading]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>در حال بارگذاری چت...</p>
        </div>
    );
  }

  if (!chat) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>چت مورد نظر یافت نشد.</p>
        </div>
    );
  }
  
  return <ChatWindow initialChat={chat} />;
}