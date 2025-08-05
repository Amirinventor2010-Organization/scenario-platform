// ===== FILE: src/components/layout/Sidebar.tsx =====

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare, Menu } from "lucide-react";
import { useChatHistory } from "@/hooks/use-chat-history";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHistoryItem from "./ChatHistoryItem";
import { ThemeToggle } from "@/components/ui/ThemeToggle"; // Corrected path
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Sidebar() {
  const { chats, isLoading } = useChatHistory();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col p-2 bg-muted/40">
      <div className="flex items-center justify-between p-2">
         <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <h1 className="text-lg font-semibold">چت‌ها</h1>
         </div>
         <ThemeToggle />
      </div>
      <Link href="/" className="p-2" onClick={() => setIsSheetOpen(false)}>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="ml-2 h-4 w-4" />
          چت جدید
        </Button>
      </Link>
      <ScrollArea className="flex-1 my-4">
        <div className="space-y-1 pr-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground p-2">در حال بارگذاری...</p>
          ) : (
            chats.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                chat={chat}
                isActive={pathname === `/chat/${chat.id}`}
                onSelect={() => setIsSheetOpen(false)}
              />
            ))
          )}
        </div>
      </ScrollArea>
      <div className="p-2 border-t">
          <p className="text-xs text-muted-foreground">ساخته شده با ❤️</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[260px] border-l">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <div className="md:hidden absolute top-4 right-4 z-50">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                  </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] p-0">
                  {sidebarContent}
              </SheetContent>
          </Sheet>
      </div>
    </>
  );
}