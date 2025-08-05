// ===== FILE: src/hooks/use-chat-history.ts =====

"use client";

import { useState, useEffect, useCallback } from "react";
import { Chat } from "@/lib/types";

const CHAT_HISTORY_KEY = "chat-history";

type RawChat = Omit<Chat, 'createdAt'> & { createdAt: string };

export function useChatHistory() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedChatsJSON = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedChatsJSON) {
        const parsedChats: RawChat[] = JSON.parse(savedChatsJSON);
        const hydratedChats = parsedChats.map((chat) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
        }));
        setChats(hydratedChats);
      }
    } catch (error) {
      console.error("Failed to load or parse chat history from localStorage:", error);
      localStorage.removeItem(CHAT_HISTORY_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveChats = (updatedChats: Chat[]) => {
    try {
      updatedChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setChats(updatedChats);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedChats));
    } catch (error) {
      console.error("Failed to save chat history to localStorage:", error);
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
  
  const getChatById = useCallback((id: string): Chat | undefined => {
    return chats.find(chat => chat.id === id);
  }, [chats]);

  return { chats, isLoading, addChat, updateChat, getChatById };
}