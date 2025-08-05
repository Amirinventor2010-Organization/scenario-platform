// ===== FILE: src/components/layout/Sidebar.tsx =====
// FINAL, ACCESSIBLE, AND RESPONSIVE VERSION

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, MessageSquare, Menu } from "lucide-react";
import { useChatHistory } from "@/hooks/use-chat-history";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatHistoryItem from "./ChatHistoryItem";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";

export default function Sidebar() {
  const { chats, isLoading } = useChatHistory();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Content for the desktop sidebar
  const sidebarDesktopContent = (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="flex items-center justify-between p-2 border-b">
         <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <h1 className="text-lg font-semibold">چت‌ها</h1>
         </div>
         <ThemeToggle />
      </div>
      <div className="p-2">
        <Link href="/" className="block" onClick={() => setIsSheetOpen(false)}>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="ml-2 h-4 w-4" />
            چت جدید
          </Button>
        </Link>
      </div>
      <ScrollArea className="flex-1 my-2">
        <div className="space-y-1 px-2">
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
      <div className="p-2 border-t mt-auto">
          <p className="text-xs text-muted-foreground">ساخته شده توسط فراز ❤️</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[260px] border-l">
        {sidebarDesktopContent}
      </aside>

      {/* Mobile Drawer (Sheet) */}
      <div className="md:hidden absolute top-2 right-2 z-50">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                  </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0 flex flex-col">
                  {/* Accessibility Fix: Add Header, Title, and Description */}
                  <SheetHeader className="p-4 border-b text-right">
                    <SheetTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 ml-2" />
                      منوی اصلی
                    </SheetTitle>
                    <SheetDescription className="text-xs pt-1">
                      چت‌های خود را مدیریت کرده یا یک چت جدید شروع کنید.
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="p-2">
                    <Link href="/" className="block" onClick={() => setIsSheetOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="ml-2 h-4 w-4" />
                        چت جدید
                      </Button>
                    </Link>
                  </div>
                  
                  <ScrollArea className="flex-1 my-2">
                    <div className="space-y-1 px-2">
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

                  <div className="p-4 border-t mt-auto">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">ساخته شده توسط فراز ❤️</p>
                      <ThemeToggle />
                    </div>
                  </div>
              </SheetContent>
          </Sheet>
      </div>
    </>
  );
}