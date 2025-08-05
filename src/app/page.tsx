// ===== FILE: src/app/page.tsx =====

"use client";

// FIX: Importing a default export does not use curly braces {}
import ChatWindow from "@/components/chat/ChatWindow";

export default function HomePage() {
  // This page renders a new, empty chat window
  return <ChatWindow />;
}