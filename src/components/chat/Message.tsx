// ===== IMPORTS & DEPENDENCIES =====
import { Message as MessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "../ui/CopyButton";

// ===== TYPES & INTERFACES =====
interface MessageProps {
  message: MessageType;
}

// ===== CORE COMPONENT LOGIC =====
export function Message({ message }: MessageProps) {
  const isAIMessage = message.role === "ai";

  return (
    <div
      className={cn(
        "flex animate-in fade-in-20 slide-in-from-bottom-4 duration-500 ease-in-out", // انیمیشن برای ورود پیام
        "items-start gap-4 p-4",
        isAIMessage ? "justify-start" : "justify-end"
      )}
    >
      {/* آیکون ربات برای پیام‌های AI */}
      {isAIMessage && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
      )}

      {/* حباب پیام */}
      <div
        className={cn(
          "max-w-2xl rounded-lg p-4 shadow-sm",
          isAIMessage
            ? "bg-muted"
            : "bg-primary text-primary-foreground"
        )}
      >
        {/* === رندر کردن محتوای ساختاریافته AI === */}
        {isAIMessage && message.structuredContent ? (
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
                {/* استفاده از ReactMarkdown برای نمایش زیبا و فرمت‌بندی شده اسکریپت */}
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
        ) : (
          /* === رندر کردن پیام‌های متنی ساده (برای کاربر یا پاسخ‌های ساده AI) === */
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* آیکون کاربر برای پیام‌های User */}
      {!isAIMessage && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}