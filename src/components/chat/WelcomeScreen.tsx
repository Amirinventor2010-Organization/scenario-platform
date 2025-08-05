// ===== FILE: src/components/chat/WelcomeScreen.tsx =====

"use client";

import { Bot, Zap } from "lucide-react";

interface WelcomeScreenProps {
  onExamplePromptClick: (prompt: string) => void;
}

const examplePrompts = [
  "یک اسکریپت برای ویدیوی معرفی محصول جدیدم بنویس",
  "ایده برای یک ریلز آموزشی در مورد آشپزی سریع",
  "یک سناریوی طنز برای تبلیغ یک کافه",
];

export function WelcomeScreen({ onExamplePromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Bot className="w-16 h-16 mb-4 text-primary" />
      <h2 className="text-2xl font-bold mb-2">مولد اسکریپت هوشمند</h2>
      <p className="text-muted-foreground mb-8">
        ایده خود را وارد کنید تا بهترین اسکریپت را برای ویدیوی خود دریافت کنید.
      </p>
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
          <Zap className="w-5 h-5 ml-2" />
          پیشنهادها
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onExamplePromptClick(prompt)}
              className="p-4 border rounded-lg text-right hover:bg-muted transition-colors w-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}