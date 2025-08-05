// ===== FILE: src/components/chat/WelcomeScreen.tsx =====

"use client";

import { Bot, Zap, PenSquare, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onExamplePromptClick: (prompt: string) => void;
}

const examplePrompts = [
  {
    icon: <PenSquare className="w-5 h-5 ml-2 text-primary" />,
    text: "یک سناریو برای ویدیوی معرفی محصول جدیدم بنویس"
  },
  {
    icon: <Sparkles className="w-5 h-5 ml-2 text-primary" />,
    text: "ایده برای یک ریلز آموزشی در مورد آشپزی سریع"
  },
  {
    icon: <Zap className="w-5 h-5 ml-2 text-primary" />,
    text: "یک سناریو ی طنز برای تبلیغ یک کافه"
  }
];

export function WelcomeScreen({ onExamplePromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 top-1/4 h-32 w-32 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute right-0 bottom-1/4 h-32 w-32 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <Bot className="w-16 h-16 mb-4 text-primary mx-auto" />
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
          هوش مصنوعی تولید کننده سناریو فراز
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          ایده خود را وارد کنید تا بهترین سناریو را برای ویدیوی وایرال بعدی خود دریافت کنید.
        </p>
        <div className="w-full max-w-md space-y-3">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt.text}
              onClick={() => onExamplePromptClick(prompt.text)}
              className="p-4 border-2 border-dashed border-border rounded-lg text-right hover:border-solid hover:border-primary hover:bg-primary/10 transition-all w-full flex items-center"
            >
              {prompt.icon}
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}