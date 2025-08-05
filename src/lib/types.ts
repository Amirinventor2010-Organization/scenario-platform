// lib/types.ts
export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  // ممکن است پاسخ AI ساختاریافته باشد
  structuredContent?: {
    title: string;
    script: string;
    caption: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}