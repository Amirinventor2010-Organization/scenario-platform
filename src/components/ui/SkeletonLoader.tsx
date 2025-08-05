// components/ui/SkeletonLoader.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";

export function SkeletonLoader() {
  return (
    <div className="flex items-start space-x-4 space-x-reverse p-4">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="space-y-3 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}