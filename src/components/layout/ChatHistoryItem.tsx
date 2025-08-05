// components/layout/ChatHistoryItem.tsx
import Link from "next/link";
import { Chat } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatHistoryItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect?: () => void;
}

export default function ChatHistoryItem({ chat, isActive, onSelect }: ChatHistoryItemProps) {
  // عنوان را به حداکثر 30 کاراکتر محدود کن
  const truncatedTitle = chat.title.length > 30 ? `${chat.title.substring(0, 30)}...` : chat.title;

  return (
    <Link
      href={`/chat/${chat.id}`}
      onClick={onSelect}
      className={cn(
        "block rounded-md p-2 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {truncatedTitle}
    </Link>
  );
}