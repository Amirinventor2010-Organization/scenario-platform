// hooks/use-chat-history.ts
"use client";

import { useState, useEffect } from "react";
import { Chat } from "@/lib/types";

const CHAT_HISTORY_KEY = "chat-history";

export function useChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedChats = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedChats) {
        // تاریخ‌ها را از رشته به شیء Date تبدیل می‌کنیم
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
        }));
        setChats(parsedChats);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveChats = (updatedChats: Chat[]) => {
    try {
      // مرتب‌سازی بر اساس تاریخ ایجاد (جدیدترین‌ها اول)
      updatedChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setChats(updatedChats);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedChats));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  };

  const addChat = (newChat: Chat) => {
    saveChats([newChat, ...chats]);
  };

  const updateChat = (updatedChat: Chat) => {
    const updatedChats = chats.map((chat) =>
      chat.id === updatedChat.id ? updatedChat : chat
    );
    saveChats(updatedChats);
  };
  
  const getChatById = (id: string): Chat | undefined => {
    return chats.find(chat => chat.id === id);
  }

  return { chats, isLoading, addChat, updateChat, getChatById };
}