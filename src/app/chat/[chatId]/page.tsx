// ===== FILE: src/app/chat/[chatId]/page.tsx =====
// This version uses React.use() to resolve the params promise, removing the warning.

"use client";

// FIX: Import 'use' from React to handle the params promise
import { useEffect, useState, use } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { useChatHistory } from "@/hooks/use-chat-history";
import { Chat } from "@/lib/types";

// The 'params' prop is now a Promise
export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  
  // FIX: Use the 'use' hook to unwrap the promise and get the actual params object
  const { chatId } = use(params);

  const { getChatById, isLoading } = useChatHistory();
  const [chat, setChat] = useState<Chat | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      const foundChat = getChatById(chatId);
      setChat(foundChat);
    }
  }, [chatId, getChatById, isLoading]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>در حال بارگذاری چت...</p>
        </div>
    );
  }

  if (!chat) {
    // This can happen briefly while the chat history is loading.
    // A more robust solution might check !isLoading && !chat
    return (
        <div className="flex items-center justify-center h-full">
            <p>چت مورد نظر یافت نشد یا در حال بارگذاری است...</p>
        </div>
    );
  }
  
  return <ChatWindow initialChat={chat} />;
}