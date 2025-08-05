// ===== FILE: src/components/chat/Message.tsx =====
// FINAL VERSION with corrected action buttons logic:
// - User: Copy, Edit
// - AI: Copy, Regenerate

"use client";

import { Message as MessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, User, Copy as CopyIcon, Edit, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../ui/CopyButton";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface MessageProps {
  message: MessageType;
  onEdit: () => void;
  onRegenerate: () => void;
}

const getMessageText = (message: MessageType): string => {
  if (message.structuredContent) {
    return `عنوان: ${message.structuredContent.title}\n\nاسکریپت:\n${message.structuredContent.script}\n\nکپشن:\n${message.structuredContent.caption}`;
  }
  return message.content;
};

export function Message({ message, onEdit, onRegenerate }: MessageProps) {
  const isAIMessage = message.role === "ai";
  const messageText = getMessageText(message);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(messageText);
    toast.success("پیام کپی شد!");
  };

  const ActionToolbar = () => (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
      <TooltipProvider>
        {/* Copy button is always available */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyToClipboard}>
              <CopyIcon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>کپی</p></TooltipContent>
        </Tooltip>

        {/* --- FIX: Conditional rendering for Edit and Regenerate buttons --- */}
        {isAIMessage ? (
          // AI Message Actions: Regenerate
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRegenerate}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>بازنویسی پاسخ</p></TooltipContent>
          </Tooltip>
        ) : (
          // User Message Actions: Edit
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>ویرایش و ارسال مجدد</p></TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );

  return (
    <div
      className={cn(
        "group flex w-full animate-in fade-in-20 slide-in-from-bottom-4 duration-500 ease-in-out",
        "items-start gap-2 md:gap-4",
        isAIMessage ? "justify-start" : "justify-end"
      )}
    >
      {isAIMessage && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div className={cn(
        "flex flex-col max-w-2xl",
        isAIMessage ? "items-start" : "items-end"
      )}>
        <div
          className={cn(
            "rounded-lg p-3 md:p-4 shadow-sm w-fit",
            isAIMessage ? "bg-muted" : "bg-primary text-primary-foreground"
          )}
        >
          {isAIMessage && message.structuredContent ? (
            <div className="min-w-[200px] md:min-w-[300px]">
              <Card className="bg-transparent border-0 shadow-none text-foreground">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="flex items-center justify-between text-lg">
                    {message.structuredContent.title}
                    <CopyButton textToCopy={JSON.stringify(message.structuredContent, null, 2)} label="کپی کل" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">📜 اسکریپت</h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-background/50 p-3 rounded-md">
                      <ReactMarkdown>{message.structuredContent.script}</ReactMarkdown>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">✍️ کپشن پیشنهادی</h4>
                        <CopyButton textToCopy={message.structuredContent.caption} label="کپی کپشن" />
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "{message.structuredContent.caption}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        
        <ActionToolbar />
      </div>

      {!isAIMessage && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}